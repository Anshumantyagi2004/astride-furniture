import { NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";

import connectDB from "@/config/connectDB";
import Category from "@/models/Category";
import { uploadToR2 } from "@/utils/uploadToR2";
import { generateSlug } from "@/utils/generateSlug";
import { verifyAdmin } from "@/lib/verifyAdmin";

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
        const name = formData.get("name");
        const image = formData.get("image");

          // ADD THESE TWO LINES:
        const metaTitleInput = formData.get("metaTitle");
        const metaDescriptionInput = formData.get("metaDescription");

        if (!name || !image) {
            return NextResponse.json(
                { success: false, message: "Name and image are required", },
                { status: 400 }
            );
        }

        // GENERATE SLUG
        let slug = generateSlug(name);
        const existingCategory = await Category.findOne({ slug, });

        if (existingCategory) { slug = `${slug}-${crypto.randomBytes(2).toString("hex")}`; }

        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const extension = path.extname(image.name);
        const fileName = `${Date.now()}-${generateSlug(name)}${extension}`;

        const uploadedImage = await uploadToR2({
            file: buffer,
            folder: "categories",
            fileName,
            contentType: image.type,
        });

                // CHANGE THESE TWO TO DYNAMICALLY USE USER INPUTS:
        const metaTitle = metaTitleInput || `${name} | Your Company`;
        const metaDescription = metaDescriptionInput || `Explore ${name} at our company. Discover premium quality products and trusted solutions.`;


        const category = await Category.create({
            name,
            slug,
            image: uploadedImage.url,
            imageField: uploadedImage.key,
            metaTitle,
            metaDescription,
        });

        categoryCache = null; // Clear cache after creating a new category

        return NextResponse.json(
            { success: true, message: "Category created successfully", category, },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { success: false, message: "Internal server error", },
            { status: 500 }
        );
    }
}

// Global in-memory cache for category GET requests (development & production)
let categoryCache = null;
let categoryCacheTime = 0;
const CATEGORY_CACHE_TTL = 30000; // 30 seconds

export async function GET() {
    try {
        const now = Date.now();
        if (categoryCache && (now - categoryCacheTime < CATEGORY_CACHE_TTL)) {
            return NextResponse.json(categoryCache, { status: 200 });
        }

        await connectDB();
        const categories = await Category.find().sort({ createdAt: -1 });

        const data = {
            success: true,
            count: categories.length,
            categories,
        };

        categoryCache = data;
        categoryCacheTime = now;
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { success: false, message: "Internal server error", },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
   try {
        if (!verifyAdmin(req)) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID is required" },
                { status: 400 }
            );
        }

        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }

        categoryCache = null; // Clear cache after deleting a category
        return NextResponse.json(
            { success: true, message: "Category deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        if (!verifyAdmin(req)) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();
        const formData = await req.formData();
        const id = formData.get("id");
        const name = formData.get("name");
        const image = formData.get("image");
        const metaTitleInput = formData.get("metaTitle");
        const metaDescriptionInput = formData.get("metaDescription");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID is required" },
                { status: 400 }
            );
        }

        const category = await Category.findById(id);
        if (!category) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }

        if (name) {
            category.name = name;
            category.slug = generateSlug(name);
        }
        // UPDATE METADATA IF USER SENT VALUES:
        if (metaTitleInput !== null && metaTitleInput !== undefined) {
            category.metaTitle = metaTitleInput;
        } else if (name) {
            category.metaTitle = `${name} | Your Company`;
        }
        if (metaDescriptionInput !== null && metaDescriptionInput !== undefined) {
            category.metaDescription = metaDescriptionInput;
        } else if (name) {
            category.metaDescription = `Explore ${name} at our company. Discover premium quality products and trusted solutions.`;
        }

        if (image && image !== "undefined" && typeof image !== "string") {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const extension = path.extname(image.name);
            const fileName = `${Date.now()}-${generateSlug(category.name || name)}${extension}`;

            const uploadedImage = await uploadToR2({
                file: buffer,
                folder: "categories",
                fileName,
                contentType: image.type,
            });

            category.image = uploadedImage.url;
            category.imageField = uploadedImage.key;
        }

        await category.save();

        categoryCache = null;

        return NextResponse.json(
            { success: true, message: "Category updated successfully", category },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}