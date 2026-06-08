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
        let product = await Product.findOne({ slug: slug }).populate("category");

        if (!product && process.env.NODE_ENV === "development") {
            try {
                const productionUrl = process.env.PRODUCTION_URL || "https://astride-furniture.vercel.app";
                const response = await fetch(`${productionUrl}/api/product/${slug}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        return NextResponse.json(data, { status: 200 });
                    }
                }
            } catch (err) {
                console.error("Error fetching fallback product from production:", err);
            }
        }

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

        const product = await Product.findOne({ slug });

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 404 }
            );
        }

        const formData = await req.formData();

        const productName = formData.get("productName");

        // DUPLICATE NAME CHECK (excluding current product)
        if (productName) {
            const existingName = await Product.findOne({
                productName: { $regex: new RegExp(`^${productName.trim()}$`, "i") },
                _id: { $ne: product._id }
            });
            if (existingName) {
                return NextResponse.json(
                    { success: false, message: "Product with this name already exists", },
                    { status: 400 }
                );
            }
        }

        const category = formData.get("category");
        const oldPrice = formData.get("oldPrice");
        const realPrice = formData.get("realPrice");
        const shortDescription = formData.get("shortDescription");
        const longDescription = formData.get("longDescription");
        const keyfeatures = formData.get("keyfeatures");
        const application = formData.get("application");
        const whychoose = formData.get("whychoose");

        const videoLinks = JSON.parse(
            formData.get("videoLinks") || "[]"
        );

        const specifications = JSON.parse(
            formData.get("specifications") || "[]"
        );

        const colorVariantsData = JSON.parse(
            formData.get("colorVariants") || "[]"
        );

        let uploadedColorVariants = [];

        const hasNewImages = colorVariantsData.some((_, index) =>
            formData.getAll(`variant_${index}`).length > 0
        );

        if (hasNewImages) {
            // DELETE OLD IMAGES
            for (const variant of product.colorVariants) {
                for (const image of variant.images) {
                    await deleteFromR2(image.imageField);
                }
            }

            // UPLOAD NEW IMAGES
            for (
                let variantIndex = 0;
                variantIndex < colorVariantsData.length;
                variantIndex++
            ) {
                const variant =
                    colorVariantsData[variantIndex];

                const files = formData.getAll(
                    `variant_${variantIndex}`
                );

                const uploadedImages = [];

                for (const image of files) {
                    const bytes =
                        await image.arrayBuffer();

                    const buffer = Buffer.from(bytes);

                    const extension = path.extname(
                        image.name
                    );

                    const fileName =
                        `${Date.now()}-${generateSlug(
                            productName
                        )}-${variant.colorName}-${crypto
                            .randomBytes(2)
                            .toString("hex")}${extension}`;

                    const uploadedImage =
                        await uploadToR2({
                            file: buffer,
                            folder: "products",
                            fileName,
                            contentType: image.type,
                        });

                    uploadedImages.push({
                        url: uploadedImage.url,
                        imageField:
                            uploadedImage.key,
                    });
                }

                uploadedColorVariants.push({
                    colorName: variant.colorName,
                    images: uploadedImages,
                });
            }

            product.colorVariants =
                uploadedColorVariants;
        }

        product.productName = productName;
        product.slug = generateSlug(productName);
        product.category = category;
        product.oldPrice = oldPrice;
        product.realPrice = realPrice;
        product.shortDescription = shortDescription;
        product.longDescription = longDescription;
        product.keyfeatures = keyfeatures;
        product.application = application;
        product.whychoose = whychoose;
        product.videoLinks = videoLinks;
        product.specifications = specifications;

        product.metaTitle =
            `${productName} | Your Company`;

        product.metaDescription =
            `Buy ${productName} at best price from our company.`;

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
            {
                success: false,
                message: "Internal server error",
            },
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
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 404 }
            );
        }

        // DELETE ALL VARIANT IMAGES
        for (const variant of product.colorVariants) {
            for (const image of variant.images) {
                await deleteFromR2(
                    image.imageField
                );
            }
        }

        await Product.findByIdAndDelete(slug);

        return NextResponse.json(
            {
                success: true,
                message: "Product deleted successfully",
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