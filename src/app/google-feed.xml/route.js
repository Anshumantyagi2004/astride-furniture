export const dynamic = "force-dynamic";

import connectDB from "@/config/connectDB";
import Product from "@/models/Product";

async function getProducts() {
    try {
        // Proxy production API in development or bypass direct DB connection if needed
        if (process.env.NODE_ENV === "development") {
            const productionUrl = "https://astride.in";
            const response = await fetch(`${productionUrl}/api/product`, { cache: "no-store" });
            const data = await response.json();
            return data.products || [];
        } else {
            await connectDB();
            const products = await Product.find({}, "slug updatedAt").sort({ createdAt: -1 });
            return products || [];
        }
    } catch (error) {
        console.error("Error fetching products for XML feed:", error);
        return [];
    }
}

export async function GET() {
    const baseUrl = "https://astride.in";
    const products = await getProducts();

    const productUrls = products
        .map(
            (product) => `
  <url>
    <loc>${baseUrl}/products/${product.slug}</loc>
    <lastmod>${product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
        )
        .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${productUrls}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
