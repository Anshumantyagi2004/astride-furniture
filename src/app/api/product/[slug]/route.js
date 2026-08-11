import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { uploadToR2 } from "@/utils/uploadToR2";
import { deleteFromR2 } from "@/utils/deleteFromR2";


// ==========================================
// GET SINGLE PRODUCT
// ==========================================

export async function GET(req, { params }) {
    try {
        await connectDB();

        const { slug } = await params;
        
        const product = await Product.findOne({
            slug: slug.toLowerCase(),
        });

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                product,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Get product error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch product",
            },
            { status: 500 }
        );
    }
}


// ==========================================
// UPDATE PRODUCT
// ==========================================

export async function PUT(req, { params }) {
    try {
        await connectDB();

        const { slug } = await params;

        // Find the existing product
        const product = await Product.findOne({
            slug: slug.toLowerCase(),
        });

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


        // ==========================================
        // PRODUCT DETAILS
        // ==========================================

        const productName =
            formData.get("productName")?.trim();

        const newSlug =
            formData.get("slug")
                ?.trim()
                .toLowerCase();

        const shortDescription =
            formData.get("shortDescription")?.trim();

        const longDescription =
            formData.get("longDescription")?.trim();

        const metaTitle =
            formData.get("metaTitle")?.trim();

        const metaDescription =
            formData.get("metaDescription")?.trim();


        // ==========================================
        // SPECIFICATIONS
        // ==========================================

        let specifications = product.specifications;

        const specificationsInput =
            formData.get("specifications");

        if (specificationsInput) {
            try {
                specifications = JSON.parse(
                    specificationsInput
                );
            } catch {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid specifications format",
                    },
                    { status: 400 }
                );
            }
        }


        // ==========================================
        // UPDATE SLUG
        // ==========================================

        if (newSlug && newSlug !== product.slug) {

            const slugAlreadyExists = await Product.findOne({
                slug: newSlug,
                _id: { $ne: product._id },
            });

            if (slugAlreadyExists) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "This slug is already being used by another product",
                    },
                    { status: 400 }
                );
            }

            product.slug = newSlug;
        }


        // ==========================================
        // EXISTING IMAGES TO KEEP
        // ==========================================

        let existingImages = product.images;

        const existingImagesInput =
            formData.get("existingImages");

        if (existingImagesInput) {
            try {
                existingImages = JSON.parse(
                    existingImagesInput
                );
            } catch {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid existingImages format",
                    },
                    { status: 400 }
                );
            }
        }


        // ==========================================
        // FIND IMAGES THAT WERE REMOVED
        // ==========================================

        const imagesToDelete = product.images.filter(
            (oldImage) =>
                !existingImages.some(
                    (newImage) =>
                        newImage.imageKey === oldImage.imageKey
                )
        );


        // ==========================================
        // NEW IMAGES
        // ==========================================

        const files = formData.getAll("images");

        const newUploadedImages = [];

        for (const file of files) {

            if (!(file instanceof File)) {
                continue;
            }

            const bytes = await file.arrayBuffer();

            const buffer = Buffer.from(bytes);

            const extension =
                file.name
                    .split(".")
                    .pop()
                    ?.toLowerCase() || "jpg";

            const fileName =
                `${Date.now()}-${crypto.randomUUID()}.${extension}`;


            const uploadedImage = await uploadToR2({
                file: buffer,
                folder: "products",
                fileName,
                contentType: file.type,
            });


            newUploadedImages.push({
                url: uploadedImage.url,
                imageKey: uploadedImage.key,
            });
        }


        // ==========================================
        // FINAL IMAGE LIST
        // ==========================================

        product.images = [
            ...existingImages,
            ...newUploadedImages,
        ];


        // ==========================================
        // UPDATE PRODUCT FIELDS
        // ==========================================

        if (productName) {
            product.productName = productName;
        }

        if (shortDescription !== undefined) {
            product.shortDescription = shortDescription;
        }

        if (longDescription !== undefined) {
            product.longDescription = longDescription;
        }

        if (metaTitle !== undefined) {
            product.metaTitle = metaTitle;
        }

        if (metaDescription !== undefined) {
            product.metaDescription = metaDescription;
        }

        product.specifications = specifications;


        // ==========================================
        // DELETE REMOVED IMAGES FROM R2 FIRST (Fault-Tolerant)
        // ==========================================

        const deletionResults = await Promise.allSettled(
            imagesToDelete.map((image) => deleteFromR2(image.imageKey))
        );

        const failedDeletions = deletionResults.filter(
            (result) => result.status === "rejected"
        );

        if (failedDeletions.length > 0) {
            console.error(
                "Some R2 images could not be deleted:",
                failedDeletions
            );

            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to delete removed images from storage. Product update aborted.",
                },
                { status: 500 }
            );
        }


        // ==========================================
        // SAVE PRODUCT
        // ==========================================

        await product.save();


        // ==========================================
        // SUCCESS
        // ==========================================

        return NextResponse.json(
            {
                success: true,
                message: "Product updated successfully",
                product,
            },
            { status: 200 }
        );

    } catch (error) {

        console.error("Update product error:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to update product",
            },
            { status: 500 }
        );
    }
}


// ==========================================
// DELETE PRODUCT
// ==========================================
// DELETE PRODUCT
export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const { slug } = await params;

        // Find product
        const product = await Product.findOne({
            slug: slug.toLowerCase(),
        });

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 404 }
            );
        }

        // Safely extract images array
        const imagesToDelete = product.images || [];

        // Delete ALL images from R2 concurrently
        const deletionResults = await Promise.allSettled(
            imagesToDelete.map((image) =>
                deleteFromR2(image.imageKey)
            )
        );

        // Check if any R2 deletion failed
        const failedDeletions = deletionResults.filter(
            (result) => result.status === "rejected"
        );

        // If even one image failed to delete, block MongoDB deletion
        if (failedDeletions.length > 0) {
            console.error(
                "Some R2 images could not be deleted:",
                failedDeletions
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Some images could not be deleted from Cloudflare R2. Product was not deleted.",
                },
                { status: 500 }
            );
        }

        // All R2 images successfully deleted -> Delete product from MongoDB
        await Product.deleteOne({
            _id: product._id,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Product and all images deleted successfully",
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Delete product error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete product",
            },
            { status: 500 }
        );
    }
}