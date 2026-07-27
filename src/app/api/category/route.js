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
        const rawName = formData.get("name");
        const name = rawName ? rawName.replace(/\s+/g, ' ').trim() : null;
        const image = formData.get("image");

        const rawMetaTitle = formData.get("metaTitle");
        const metaTitleInput = rawMetaTitle ? rawMetaTitle.replace(/\s+/g, ' ').trim() : null;
        const rawMetaDesc = formData.get("metaDescription");
        const metaDescriptionInput = rawMetaDesc ? rawMetaDesc.replace(/\s+/g, ' ').trim() : null;

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

        // Cache invalidation not needed since cache is disabled
        categoryCache = null;

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

// Global in-memory cache disabled for real-time updates
// When admin updates categories, changes should be immediately visible
let categoryCache = null;
const CATEGORY_CACHE_TTL = 0; // Cache disabled for real-time data

export async function GET() {
    try {
        await connectDB();
        const categories = await Category.find().sort({ createdAt: -1 }).lean();

        const data = {
            success: true,
            count: categories.length,
            categories,
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
        const rawName = formData.get("name");
        const name = rawName ? rawName.replace(/\s+/g, ' ').trim() : null;
        const image = formData.get("image");
        const rawMetaTitle = formData.get("metaTitle");
        const metaTitleInput = rawMetaTitle ? rawMetaTitle.replace(/\s+/g, ' ').trim() : null;
        const rawMetaDesc = formData.get("metaDescription");
        const metaDescriptionInput = rawMetaDesc ? rawMetaDesc.replace(/\s+/g, ' ').trim() : null;

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