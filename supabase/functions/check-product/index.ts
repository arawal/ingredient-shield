import { serve } from "https://deno.land/std@0.192.0/http/server.ts"

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
    // (We will add this in a later step, for now it's public)

    // 2. Fetch product from Open Food Facts
    const offResponse = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
    if (!offResponse.ok) throw new Error("Product not found");
    
    const productData = await offResponse.json();
    const ingredients = productData.product?.ingredients_text || "";
    const productName = productData.product?.product_name || "Unknown Product";

    // 3. Get user's rules (Mocked for now)
    // In a real step, you'd fetch this from Supabase DB based on user auth
    const mockUserRules = [
      { type: 'allergy', value: 'peanuts' },
      { type: 'ethics', value: 'palm oil' }
    ];

    // 4. Run the rules engine
    const violations = await runRulesEngine(ingredients, mockUserRules);

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