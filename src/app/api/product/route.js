import { NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import connectDB from "@/config/connectDB";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { uploadToR2 } from "@/utils/uploadToR2";
import { generateSlug } from "@/utils/generateSlug";

export async function POST(req) {
    try {
        await connectDB();
        const formData = await req.formData();

        // FIELDS
        const productName = formData.get("productName");
        const category = formData.get("category");
        const oldPrice = formData.get("oldPrice");
        const realPrice = formData.get("realPrice");
        const shortDescription = formData.get("shortDescription");
        const longDescription = formData.get("longDescription");
        const keyfeatures = formData.get("keyfeatures");
        const application = formData.get("application");
        const whychoose = formData.get("whychoose");
        const videoLinks = JSON.parse(formData.get("videoLinks") || "[]");
        const specifications = JSON.parse(formData.get("specifications") || "[]");
        const colorVariantsData = JSON.parse(
            formData.get("colorVariants") || "[]"
        );

        // VALIDATION
        if (!productName || !category || !oldPrice || !realPrice || !shortDescription || !longDescription) {
            return NextResponse.json(
                { success: false, message: "All fields are required", },
                { status: 400 }
            );
        }

        // DUPLICATE NAME CHECK
        const existingName = await Product.findOne({ productName: { $regex: new RegExp(`^${productName.trim()}$`, "i") } });
        if (existingName) {
            return NextResponse.json(
                { success: false, message: "Product with this name already exists", },
                { status: 400 }
            );
        }

        // CATEGORY CHECK
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return NextResponse.json(
                { success: false, message: "Category not found", },
                { status: 404 }
            );
        }

        // GENERATE SLUG
        let slug = generateSlug(productName);
        const existingProduct = await Product.findOne({ slug, });
        if (existingProduct) { slug = `${slug}-${crypto.randomBytes(2).toString("hex")}`; }

        // UPLOAD IMAGES
        const uploadedColorVariants = [];

        for (
            let variantIndex = 0;
            variantIndex < colorVariantsData.length;
            variantIndex++
        ) {
            const variant = colorVariantsData[variantIndex];

            const files = formData.getAll(
                `variant_${variantIndex}`
            );

            const uploadedImages = [];

            for (const image of files) {
                const bytes = await image.arrayBuffer();
                const buffer = Buffer.from(bytes);

                const extension = path.extname(image.name);

                const fileName =
                    `${Date.now()}-${generateSlug(productName)}-${variant.colorName}${extension}`;

                const uploadedImage = await uploadToR2({
                    file: buffer,
                    folder: "products",
                    fileName,
                    contentType: image.type,
                });

                uploadedImages.push({
                    url: uploadedImage.url,
                    imageField: uploadedImage.key,
                });
            }

            uploadedColorVariants.push({
                colorName: variant.colorName,
                images: uploadedImages,
            });
        }

        // AUTO META
        const metaTitle = `${productName} | Your Company`;

        const metaDescription = `Buy ${productName} at best price from our company. Discover premium quality products with trusted service.`;

        // CREATE PRODUCT
        const product = await Product.create({
            productName,
            slug,
            category,
            oldPrice,
            realPrice,
            shortDescription,
            longDescription,
            keyfeatures,
            application,
            whychoose,
            colorVariants: uploadedColorVariants,
            videoLinks,
            specifications,
            metaTitle,
            metaDescription,
        });

        return NextResponse.json(
            { success: true, message: "Product created successfully", product, },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { success: false, message: error.message || "Internal server error", },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        // Proxy production API when running locally to bypass DB connection issues
        if (process.env.NODE_ENV === "development") {
            const productionUrl = process.env.PRODUCTION_URL || "https://astride-furniture.vercel.app";
            const response = await fetch(`${productionUrl}/api/product`, { cache: "no-store" });
            const data = await response.json();
            return NextResponse.json(data, { status: 200 });
        }

        await connectDB();
        const products = await Product.find().populate("category").sort({ createdAt: -1 });

        return NextResponse.json(
            {
                success: true,
                count: products.length,
                products,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}