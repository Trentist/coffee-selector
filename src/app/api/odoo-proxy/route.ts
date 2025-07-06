import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const odooUrl = process.env.ODOO_API_URL || "https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf";

  try {
    // Log the incoming GET request for debugging
    console.log("🔍 Odoo Proxy GET Request:");
    console.log("URL:", odooUrl);
    console.log("Headers:", Object.fromEntries(req.headers.entries()));

    // Prepare headers for Odoo request
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add authorization header if present
    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      headers.authorization = authHeader;
      console.log("✅ Authorization header included");
    } else {
      console.log("⚠️ No authorization header");
    }

    // Add additional headers that might be needed
    const additionalHeaders = [
      "X-Client",
      "X-Version", 
      "X-Database",
      "Accept",
      "Accept-Language"
    ];

    additionalHeaders.forEach(headerName => {
      const value = req.headers.get(headerName);
      if (value) {
        headers[headerName] = value;
      }
    });

    console.log("📤 Forwarding GET request to Odoo...");
    const startTime = Date.now();

    const odooRes = await fetch(odooUrl, {
      method: "GET",
      headers,
    });

    const responseTime = Date.now() - startTime;
    console.log(`📥 Odoo GET response received in ${responseTime}ms`);
    console.log("Status:", odooRes.status, odooRes.statusText);

    const data = await odooRes.text();
    console.log("Response length:", data.length);

    // Return the response with proper headers
    return new Response(data, { 
      status: odooRes.status, 
      headers: { 
        "Content-Type": "application/json",
        "X-Proxy-Response-Time": responseTime.toString(),
        "X-Proxy-Status": "success"
      } 
    });

  } catch (error: any) {
    console.error("💥 Proxy GET error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Proxy GET error", 
        details: error.message,
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

export async function POST(req: NextRequest) {
  const odooUrl = process.env.ODOO_API_URL || "https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf";
  const body = await req.text();

  try {
    // Log the incoming request for debugging
    console.log("🔍 Odoo Proxy POST Request:");
    console.log("URL:", odooUrl);
    console.log("Headers:", Object.fromEntries(req.headers.entries()));
    console.log("Body length:", body.length);
    console.log("Body preview:", body.substring(0, 200) + "...");

    // Parse the request body to validate it's a valid GraphQL query
    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
      console.log("Query:", parsedBody.query?.substring(0, 100) + "...");
    } catch (parseError) {
      console.error("❌ Invalid JSON in request body");
      return new Response(
        JSON.stringify({ 
          error: "Invalid JSON", 
          details: "Request body must be valid JSON" 
        }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate that it's a GraphQL query
    if (!parsedBody.query) {
      console.error("❌ Missing GraphQL query");
      return new Response(
        JSON.stringify({ 
          error: "Missing query", 
          details: "Request must contain a GraphQL query" 
        }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Prepare headers for Odoo request
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add authorization header if present
    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      headers.authorization = authHeader;
      console.log("✅ Authorization header included");
    } else {
      console.log("⚠️ No authorization header");
    }

    // Add additional headers that might be needed
    const additionalHeaders = [
      "X-Client",
      "X-Version", 
      "X-Database",
      "Accept",
      "Accept-Language"
    ];

    additionalHeaders.forEach(headerName => {
      const value = req.headers.get(headerName);
      if (value) {
        headers[headerName] = value;
      }
    });

    console.log("📤 Forwarding request to Odoo...");
    const startTime = Date.now();

    const odooRes = await fetch(odooUrl, {
      method: "POST",
      headers,
      body,
    });

    const responseTime = Date.now() - startTime;
    console.log(`📥 Odoo response received in ${responseTime}ms`);
    console.log("Status:", odooRes.status, odooRes.statusText);

    const data = await odooRes.text();
    console.log("Response length:", data.length);

    // Try to parse the response to validate it's valid JSON
    try {
      const parsedResponse = JSON.parse(data);
      
      // Check for GraphQL errors
      if (parsedResponse.errors) {
        console.error("❌ GraphQL Errors:", parsedResponse.errors);
      } else if (parsedResponse.data) {
        console.log("✅ GraphQL data received successfully");
        
        // Log some basic info about the response
        const dataKeys = Object.keys(parsedResponse.data);
        console.log("Data keys:", dataKeys);
        
        // Log specific data counts if available
        if (parsedResponse.data.products) {
          const products = parsedResponse.data.products;
          console.log(`📦 Products: ${products.total_count || products.products?.length || 0}`);
        }
        if (parsedResponse.data.categories) {
          const categories = parsedResponse.data.categories;
          console.log(`📂 Categories: ${categories.total_count || categories.items?.length || 0}`);
        }
      } else {
        console.warn("⚠️ Response has no data or errors");
      }
    } catch (parseError) {
      console.error("❌ Invalid JSON response from Odoo:", parseError);
      console.log("Raw response (first 500 chars):", data.substring(0, 500));
    }

    // Return the response with proper headers
    return new Response(data, { 
      status: odooRes.status, 
      headers: { 
        "Content-Type": "application/json",
        "X-Proxy-Response-Time": responseTime.toString(),
        "X-Proxy-Status": "success"
      } 
    });

  } catch (error: any) {
    console.error("💥 Proxy error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Proxy error", 
        details: error.message,
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
