import React from 'react';
import dynamicImport from 'next/dynamic';
import Loader from "@/components/ui/loader";
import connectDB from "@/config/connectDB";
import Category from "@/models/Category";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (slug) {
    try {
      await connectDB();
      const categoryData = await Category.findOne({ slug });
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
});

function mapProduct(prod) {
  const discPercent = prod.oldPrice && prod.realPrice
    ? Math.round((1 - (prod.realPrice / prod.oldPrice)) * 100)
    : 60;

  const category = prod.category && prod.category.name ? prod.category.name : "Staff Chair";

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

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  let preloadedProducts = [];
  let preloadedCategories = [];

  try {
    await connectDB();

    const rawProducts = await Product.find({})
      .populate("category")
      .sort({ createdAt: -1 })
      .lean();

    preloadedProducts = JSON.parse(JSON.stringify(rawProducts)).map(mapProduct);

    const rawCategories = await Category.find({}).lean();
    preloadedCategories = JSON.parse(JSON.stringify(rawCategories));
  } catch (error) {
    console.error("Server-side preloading failed on category page:", error);
  }

  return (
    <ProductPageHome 
      preloadedProducts={preloadedProducts} 
      preloadedCategories={preloadedCategories} 
      initialCategorySlug={slug}
    />
  );
}
