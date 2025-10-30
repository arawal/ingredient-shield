import { serve } from "std/http/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// This is your Rules Engine!
interface Rule {
  type: string;
  value: string;
}

interface IngredientMapping {
  rule_value: string;
  synonyms: string[];
}

async function runRulesEngine(productIngredients: string, userRules: Rule[], supabase: SupabaseClient) {
  const violations: string[] = [];
  const ingredientsLower = productIngredients.toLowerCase();

  // Fetch ingredient mappings for all user rules at once
  const { data: mappings, error: mappingsError } = await supabase
    .from('ingredient_mappings')
    .select('rule_value, synonyms')
    .in('rule_value', userRules.map(rule => rule.value.toLowerCase()));

  if (mappingsError) {
    console.error('Error fetching ingredient mappings:', mappingsError);
    // Fall back to basic check if mappings fail
    for (const rule of userRules) {
      if (ingredientsLower.includes(rule.value.toLowerCase())) {
        violations.push(rule.value);
      }
    }
    return violations;
  }

  // Create a map for quick access to synonyms
  const mappingsMap = new Map<string, string[]>();
  mappings.forEach((mapping: IngredientMapping) => {
    mappingsMap.set(mapping.rule_value, mapping.synonyms);
  });

  // Check each rule against ingredients
  for (const rule of userRules) {
    const ruleValueLower = rule.value.toLowerCase();
    const synonyms = mappingsMap.get(ruleValueLower) || [];

    // First check the main rule value
    if (ingredientsLower.includes(ruleValueLower)) {
      violations.push(rule.value);
      continue; // Skip synonym checks if main value is found
    }

    // Then check all synonyms
    for (const synonym of synonyms) {
      if (ingredientsLower.includes(synonym.toLowerCase())) {
        violations.push(rule.value);
        break; // Stop checking synonyms once we find a match
      }
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
    const violations = await runRulesEngine(ingredients, userRules, supabase);

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