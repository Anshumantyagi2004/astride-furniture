import { NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";

import connectDB from "@/config/connectDB";
import Category from "@/models/Category";
import { uploadToR2 } from "@/utils/uploadToR2";
import { generateSlug } from "@/utils/generateSlug";

export async function POST(req) {
    try {
        await connectDB();
        const formData = await req.formData();
        const name = formData.get("name");
        const image = formData.get("image");

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

        const metaTitle = `${name} | Your Company`;

        const metaDescription = `Explore ${name} at our company. Discover premium quality products and trusted solutions.`;

        const category = await Category.create({
            name,
            slug,
            image: uploadedImage.url,
            imageField: uploadedImage.key,
            metaTitle,
            metaDescription,
        });

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

export async function GET() {
    try {
        await connectDB();
        const categories = await Category.find().sort({ createdAt: -1 });

        return NextResponse.json(
            {
                success: true,
                count: categories.length,
                categories,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { success: false, message: "Internal server error", },
            { status: 500 }
        );
    }
}