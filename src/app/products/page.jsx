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
  const resolvedSearchParams = await searchParams;
  const categoryName = resolvedSearchParams?.category;

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

  const primaryVariant = prod.colorVariants?.find(
    (v) => v.images && v.images.length > 0
  ) || prod.colorVariants?.[0];

  const defaultVariant = primaryVariant;
  const sortedVariantImages = defaultVariant?.images
    ? [...defaultVariant.images].sort((a, b) => {
        const aIsInfographic = a.imageType === "infographic";
        const bIsInfographic = b.imageType === "infographic";
        if (aIsInfographic && !bIsInfographic) return -1;
        if (!aIsInfographic && bIsInfographic) return 1;
        return 0;
      })
    : [];
  const allImages = sortedVariantImages.map((img) => img.url || img);
  const coverImage = sortedVariantImages[0]?.url || defaultVariant?.images?.[0]?.url || "/Png1/chair12_ErgoFit.webp";

  return {
    id: prod._id,
    slug: prod.slug,
    name: prod.productName,
    price: prod.realPrice,
    originalPrice: prod.oldPrice,
    discount: `-${discPercent}%`,
    image: coverImage,
    allImages: Array.from(new Set(allImages)),
    category: category,
    color: defaultVariant?.colorName || prod.color || "Standard",
    colorVariants: prod.colorVariants || [],
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
    const mapped = JSON.parse(JSON.stringify(rawProducts)).map(mapProduct);

    const PRIORITY_CHAIRS = [
      "octave",
      "ergofit",
      "erizo",
      "airsense",
      "avein pro",
      "ace",
      "amica",
      "rapid",
      "alpha"
    ];

    preloadedProducts = mapped.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      const indexA = PRIORITY_CHAIRS.findIndex(p => nameA.includes(p));
      const indexB = PRIORITY_CHAIRS.findIndex(p => nameB.includes(p));

      const hasA = indexA !== -1;
      const hasB = indexB !== -1;

      if (hasA && !hasB) return -1;
      if (!hasA && hasB) return 1;
      if (hasA && hasB) return indexA - indexB;

      return 0;
    });

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
