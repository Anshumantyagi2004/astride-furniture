import React from 'react';
import DetailPage from '@/components/detailPage/detailPage';
import connectDB from "@/config/connectDB";
import Product from "@/models/Product";

export async function generateMetadata({ params }) {
    const { id } = await params;
    try {
        await connectDB();
        let product = null;
        if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(id);
        }
        if (!product) {
            product = await Product.findOne({ slug: id });
        }

        if (!product) {
            return {
                title: "Astride Premium Seating | Premium Office & Ergonomic Chairs",
                description: "Experience premium comfort with Astride Chairs. Explore our range of dynamic ergonomic chairs, office task chairs, and bar stools.",
            };
        }

        return {
            title: product.metaTitle || `${product.productName} | Astride Premium Seating`,
            description: product.metaDescription || product.shortDescription || `Buy ${product.productName} at the best price from Astride.`,
        };
    } catch (e) {
        console.error("Error generating metadata:", e);
        return {
            title: "Astride Premium Seating | Premium Office & Ergonomic Chairs",
            description: "Experience premium comfort with Astride Chairs.",
        };
    }
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-white pt-0 pb-12">
      <DetailPage productId={id} />
    </div>
  );
}

