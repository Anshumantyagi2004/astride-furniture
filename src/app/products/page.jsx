import React from 'react'
import dynamicImport from 'next/dynamic'
import Loader from "@/components/ui/loader";
import connectDB from "@/config/connectDB";
import Category from "@/models/Category";
import Product from "@/models/Product";

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

// Remap raw MongoDB product doc to the shape ProductPageCard expects
function mapProduct(prod) {
  const discPercent = prod.oldPrice && prod.realPrice
    ? Math.round((1 - (prod.realPrice / prod.oldPrice)) * 100)
    : 60;

  const category = prod.category && prod.category.name ? prod.category.name : "Gaming Chair";

  const blackVariant = prod.colorVariants?.find(
    (v) => v.colorName?.toLowerCase() === "black"
  );
  const blackImage = blackVariant?.images?.[0]?.url;

  const fallbackVariant = prod.colorVariants?.find(
    (v) => v.images && v.images.length > 0
  );
  const fallbackImage = fallbackVariant?.images?.[0]?.url;

  const defaultVariant = blackVariant || fallbackVariant;
  const allImages = defaultVariant?.images?.map((img) => img.url) || [];

  return {
    id: prod._id,
    slug: prod.slug,
    name: prod.productName,
    price: prod.realPrice,
    originalPrice: prod.oldPrice,
    discount: `-${discPercent}%`,
    image: blackImage || fallbackImage || "/Png1/chair12_ErgoFit.webp",
    allImages: [...new Set(allImages)],
    category: category,
    backSupport: prod.backSupport || "High Back",
    height: prod.height || "5'7\" - 6'6\"",
    hours: prod.hours || "8+ Hours",
    colors: prod.colors || ["#0f172a"],
    rating: prod.rating || 4.7,
    capacity: prod.capacity || "150 kg",
  };
}

export default async function page() {
  let preloadedProducts = [];
  let preloadedCategories = [];

  try {
    await connectDB();

    const rawProducts = await Product.find({})
      .populate("category")
      .sort({ createdAt: -1 })
      .lean();

    // Remap to the field shape expected by ProductPageCard
    preloadedProducts = JSON.parse(JSON.stringify(rawProducts)).map(mapProduct);

    const rawCategories = await Category.find({}).lean();
    preloadedCategories = JSON.parse(JSON.stringify(rawCategories));
  } catch (error) {
    console.error("Server-side preloading failed:", error);
  }

  return (
    <ProductPageHome 
      preloadedProducts={preloadedProducts} 
      preloadedCategories={preloadedCategories} 
    />
  )
}
