// app/api/product/[id]/route.js

import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Product from "@/models/Product";
import { uploadToR2 } from "@/utils/uploadToR2";
import { deleteFromR2 } from "@/utils/deleteFromR2";
import { generateSlug } from "@/utils/generateSlug";
import crypto from "crypto";
import path from "path";

// GET SINGLE PRODUCT
export async function GET(req, { params }) {
    try {
        await connectDB();
        const { slug } = await params;
        const product = await Product.findOne({ slug: slug }).populate("category");

        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found", },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, product, },
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

// UPDATE PRODUCT
export async function PUT(req, { params }) {
    try {
        await connectDB();
        const { slug } = await params;
        const product = await Product.findOne({ slug: slug })

        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found", },
                { status: 404 }
            );
        }

        const formData = await req.formData();
        const productName = formData.get("productName");
        const category = formData.get("category");
        const oldPrice = formData.get("oldPrice");
        const realPrice = formData.get("realPrice");
        const shortDescription = formData.get("shortDescription");
        const longDescription = formData.get("longDescription");
        const videoLinks = JSON.parse(formData.get("videoLinks") || "[]");
        const specifications = JSON.parse(formData.get("specifications") || "[]");
        const imageFiles = formData.getAll("images");

        // DELETE OLD IMAGES
        if (imageFiles.length > 0) {
            for (const image of product.images) {
                await deleteFromR2(image.imageField);
            }

            const uploadedImages = [];
            for (const image of imageFiles) {
                const bytes = await image.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const extension = path.extname(image.name);

                const fileName = `${Date.now()}-${generateSlug(productName)}-${crypto.randomBytes(2).toString("hex")}${extension}`;

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

            product.images = uploadedImages;
        }

        // UPDATE DATA
        product.productName = productName;
        product.slug = generateSlug(productName);
        product.category = category;
        product.oldPrice = oldPrice;
        product.realPrice = realPrice;
        product.shortDescription = shortDescription;
        product.longDescription = longDescription;
        product.videoLinks = videoLinks;
        product.specifications = specifications;
        product.metaTitle = `${productName} | Your Company`;
        product.metaDescription = `Buy ${productName} at best price from our company.`;
        await product.save();

        return NextResponse.json(
            {
                success: true,
                message: "Product updated successfully",
                product,
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

// DELETE PRODUCT
export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { slug } = await params;
        const product = await Product.findById(slug);

        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found", },
                { status: 404 }
            );
        }

        // DELETE IMAGES
        for (const image of product.images) {
            await deleteFromR2(image.imageField);
        }

        await Product.findByIdAndDelete(slug);
        return NextResponse.json(
            { success: true, message: "Product deleted successfully", },
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