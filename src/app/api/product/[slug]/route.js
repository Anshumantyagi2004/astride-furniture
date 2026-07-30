// app/api/product/[id]/route.js

import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import { verifyAdmin } from "@/lib/verifyAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;
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
        let product = null;
        if (slug && slug.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(slug).populate("category");
        }
        if (!product) {
            product = await Product.findOne({ slug: slug }).populate("category");
        }

        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found", },
                { status: 404 }
            );
        }

        const response = NextResponse.json(
            { success: true, product, },
            { status: 200 }
        );
        
        // Prevent caching to ensure fresh data is always served
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

// UPDATE PRODUCT
export async function PUT(req, { params }) {
    try {
        if (!verifyAdmin(req)) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

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
         const customSlug = formData.get("slug");

        // ADD THESE TWO:
        const metaTitleInput = formData.get("metaTitle");
        const metaDescriptionInput = formData.get("metaDescription");

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

        const chairSpecs = JSON.parse(
            formData.get("chairSpecs") || "[]"
        );

        const colorVariantsData = JSON.parse(
            formData.get("colorVariants") || "[]"
        );

        // Determine which old images to keep
        const allExistingImagesToKeep = colorVariantsData.flatMap(v => (v.existingImages || []).map(img => img.imageField));

        const imagesToDelete = [];
        for (const variant of product.colorVariants) {
            for (const image of variant.images) {
                if (!allExistingImagesToKeep.includes(image.imageField)) {
                    imagesToDelete.push(image.imageField);
                }
            }
        }

        // Delete removed images asynchronously
        await Promise.all(imagesToDelete.map(imageField => deleteFromR2(imageField)));

        // Upload new images and merge with existing ones
        const uploadedColorVariants = await Promise.all(
            colorVariantsData.map(async (variant, variantIndex) => {
                const files = formData.getAll(`variant_${variantIndex}`);

                const uploadedImages = await Promise.all(
                    files.map(async (image, imgIdx) => {
                        const bytes = await image.arrayBuffer();
                        const buffer = Buffer.from(bytes);
                        let extension = path.extname(image.name || "");
                        if (!extension) {
                            extension = image.type === "image/webp" ? ".webp" : (image.type === "image/jpeg" || image.type === "image/jpg" ? ".jpg" : ".png");
                        }
                        const fileName = `${Date.now()}-${generateSlug(productName)}-${variant.colorName}-${crypto.randomBytes(2).toString("hex")}${extension}`;

                        const uploadedImage = await uploadToR2({
                            file: buffer,
                            folder: "products",
                            fileName,
                            contentType: image.type,
                        });

                        const newType = variant.newImageTypes && variant.newImageTypes[imgIdx] ? variant.newImageTypes[imgIdx] : "png";

                        return {
                            url: uploadedImage.url,
                            imageField: uploadedImage.key,
                            imageType: newType,
                        };
                    })
                );

                const existingImages = (variant.existingImages || []).map((img) => ({
                    url: img.url,
                    imageField: img.imageField || (img.url ? img.url.split("/").pop() : "products/image"),
                    imageType: img.imageType || "png",
                }));

                return {
                    colorName: variant.colorName,
                    colorCode: variant.colorCode || "",
                    secondaryColorCode: variant.secondaryColorCode || "",
                    colorMode: variant.colorMode || "name",
                    images: [...existingImages, ...uploadedImages],
                };
            })
        );

        product.colorVariants = uploadedColorVariants;

        // UPDATE SLUG LOGIC
        if (customSlug) {
            const formattedSlug = generateSlug(customSlug);
            const duplicateSlug = await Product.findOne({
                slug: formattedSlug,
                _id: { $ne: product._id } // Don't match against itself
            });
            
            if (duplicateSlug) {
                return NextResponse.json(
                    { success: false, message: "This slug is already in use by another product." },
                    { status: 400 }
                );
            }
            product.slug = formattedSlug;
        } else if (productName) {
            // If they didn't provide a custom slug, but they changed the name, regenerate the slug
            product.slug = generateSlug(productName);
        }

        // UPDATE NAME LOGIC
        if (productName) {
            product.productName = productName;
        }

        product.category = category ?? product.category;
        product.oldPrice = oldPrice ?? product.oldPrice;
        product.realPrice = realPrice ?? product.realPrice;
        product.shortDescription = shortDescription ?? product.shortDescription;
        product.longDescription = longDescription ?? product.longDescription;
        product.keyfeatures = keyfeatures ?? product.keyfeatures;
        product.application = application ?? product.application;
        product.whychoose = whychoose ?? product.whychoose;
        product.chairSpecs = (chairSpecs && chairSpecs.length) ? chairSpecs : product.chairSpecs;
        product.videoLinks = (videoLinks && videoLinks.length) ? videoLinks : product.videoLinks;
        product.specifications = (specifications && specifications.length) ? specifications : product.specifications;

        // UPDATE METADATA VALUES:
        if (metaTitleInput !== null && metaTitleInput !== undefined) {
            product.metaTitle = metaTitleInput;
        } else if (productName) {
            product.metaTitle = `${productName} | Your Company`;
        }
        if (metaDescriptionInput !== null && metaDescriptionInput !== undefined) {
            product.metaDescription = metaDescriptionInput;
        } else if (productName) {
            product.metaDescription = `Buy ${productName} at best price from our company.`;
        }

        await product.save();

        // Invalidate global product cache
        global.productCache = null;
        global.productCacheTime = 0;

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
                message: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}

// DELETE PRODUCT
export async function DELETE(req, { params }) {
    try {
        if (!verifyAdmin(req)) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

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

        // Invalidate global product cache
        global.productCache = null;
        global.productCacheTime = 0;

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