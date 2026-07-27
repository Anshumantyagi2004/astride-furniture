import { NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import connectDB from "@/config/connectDB";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { uploadToR2 } from "@/utils/uploadToR2";
import { generateSlug } from "@/utils/generateSlug";
import { verifyAdmin } from "@/lib/verifyAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req) {
    try {
        if (!verifyAdmin(req)) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();
        const formData = await req.formData();

        // FIELDS
        const productName = formData.get("productName");
          const customSlug = formData.get("slug");

        const category = formData.get("category");
        // ADD THESE TWO:
        const metaTitleInput = formData.get("metaTitle");
        const metaDescriptionInput = formData.get("metaDescription");
        const oldPrice = formData.get("oldPrice");
        const realPrice = formData.get("realPrice");
        const shortDescription = formData.get("shortDescription");
        const longDescription = formData.get("longDescription");
        const keyfeatures = formData.get("keyfeatures");
        const application = formData.get("application");
        const whychoose = formData.get("whychoose");
        const videoLinks = JSON.parse(formData.get("videoLinks") || "[]");
        const specifications = JSON.parse(formData.get("specifications") || "[]");
        const chairSpecs = JSON.parse(formData.get("chairSpecs") || "[]");

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
        let slug = customSlug ? generateSlug(customSlug) : generateSlug(productName);
        const existingProduct = await Product.findOne({ slug });
        
        if (existingProduct) { 
            slug = `${slug}-${crypto.randomBytes(2).toString("hex")}`; 
        }
        

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
        const metaTitle = metaTitleInput || `${productName} | Your Company`;
        const metaDescription = metaDescriptionInput || `Buy ${productName} at best price from our company. Discover premium quality products with trusted service.`;

        

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
            chairSpecs, // <--- Add this line
            metaTitle,
            metaDescription,
        });

        // Invalidate cache
        global.productCache = null;
        global.productCacheTime = 0;

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

// Global in-memory cache disabled for real-time updates
// When admin updates products, changes should be immediately visible on client
const CACHE_TTL = 0; // Cache disabled

export async function GET() {
    try {
        let data;
        await connectDB();
        const products = await Product.find(
            {}, 
            "productName slug category oldPrice realPrice backSupport height hours colors rating capacity colorVariants metaTitle metaDescription shortDescription"
        ).populate("category").sort({ createdAt: -1 }).lean();

        data = {
            success: true,
            count: products.length,
            products,
        };

        const response = NextResponse.json(data, { status: 200 });
        
        // Add no-cache headers for real-time updates
        response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        response.headers.set("Pragma", "no-cache");
        response.headers.set("Expires", "0");
        
        return response;
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