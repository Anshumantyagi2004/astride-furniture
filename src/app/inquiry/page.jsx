import React from "react";
import Inquiry from "./Inquiry";
import { ProductsProvider } from "@/context/ProductsContext";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import CategoryModel from "@/models/Category";
import WhatsWrapper from "@/components/inquiry/WhatsWrapper";

export default async function page() {
  let initialProducts = [];
  let initialCategories = [];
  try {
    await connectDB();
    const [products, categories] = await Promise.all([
      Product.find(
        {},
        "productName slug category oldPrice realPrice backSupport height hours colors rating capacity colorVariants metaTitle metaDescription shortDescription",
      )
        .populate("category")
        .sort({ createdAt: -1 })
        .lean(),
      CategoryModel.find().sort({ createdAt: -1 }).lean(),
    ]);

    // Serialize to pass from Server Component to Client Component
    initialProducts = JSON.parse(JSON.stringify(products));
    initialCategories = JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Failed to fetch data on server", error);
  }
  return (
    <>
      <ProductsProvider initialProducts={initialProducts}>
        <WhatsWrapper/>
        <Inquiry />
      </ProductsProvider>
    </>
  );
}
