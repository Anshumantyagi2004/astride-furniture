import React from 'react'
import dynamicImport from 'next/dynamic'
import Loader from "@/components/ui/loader";
import connectDB from "@/config/connectDB";
import Category from "@/models/Category";

// Force dynamic rendering to always fetch fresh product data
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Dynamic metadata generator based on category query param and database values
export async function generateMetadata({ searchParams }) {
  const categoryName = searchParams?.category;

  if (categoryName) {
    try {
      await connectDB();
      // Fetch category from database using the name query parameter
      const categoryData = await Category.findOne({ name: categoryName });
      
      if (categoryData && categoryData.metaTitle && categoryData.metaDescription) {
        return {
          title: categoryData.metaTitle,
          description: categoryData.metaDescription,
        };
      }
    } catch (error) {
      console.error("Error fetching category metadata:", error);
    }
  }

  // Default metadata for the general products page if no category matches
  return {
    title: "Shop Premium Ergonomic Chairs | Astride",
    description: "Explore our full collection of premium ergonomic office chairs, gaming chairs, study chairs, and bar stools engineered for ultimate comfort.",
  };
}

const ProductPageHome = dynamicImport(() => import('@/components/prodcutPage/ProductPageHome'), {
  loading: () => (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
      <Loader />
    </div>
  )
})

export default function page() {
  return (
    <ProductPageHome />
  )
}
