import { serve } from "std/http/server";
import { createClient } from "@supabase/supabase-js";

// This is your Rules Engine!
interface Rule {
  type: string;
  value: string;
}

async function runRulesEngine(productIngredients: string, userRules: Rule[]) {
  const violations: string[] = [];
  const ingredientsLower = productIngredients.toLowerCase();

  for (const rule of userRules) {
    const ruleValueLower = rule.value.toLowerCase();
    
    // This is a simple MVP check.
    // You'll expand this in Step 12.
    if (ingredientsLower.includes(ruleValueLower)) {
      violations.push(rule.value);
    }
  }
  return violations;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*", // Be more specific in prod
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { barcode } = await req.json();
    if (!barcode) throw new Error("Barcode is required");

    // 1. Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing auth header');
    }

    // Create Supabase client using automatic env vars
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    
    // Get user ID from JWT
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    
    if (userError || !user) {
      throw new Error('Invalid auth token');
    }

    // 2. Fetch user's rules from database
    const { data: userRules, error: rulesError } = await supabase
      .from('rules')
      .select('type, value')
      .eq('user_id', user.id);

    if (rulesError) {
      throw new Error('Failed to fetch user rules');
    }

    // 3. Fetch product from Open Food Facts
    const offResponse = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
    if (!offResponse.ok) throw new Error("Product not found");
    
    const productData = await offResponse.json();
    const ingredients = productData.product?.ingredients_text || "";
    const productName = productData.product?.product_name || "Unknown Product";

    // 4. Run the rules engine
    const violations = await runRulesEngine(ingredients, userRules);

    const status = violations.length > 0 ? "red" : "green";

    const data = {
      status,
      violations,
      productName,
      ingredients,
    };

    return new Response(JSON.stringify(data), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }
})