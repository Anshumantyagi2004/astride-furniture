import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        // PRODUCT NAME
        productName: {
            type: String,
            required: true,
            trim: true,
        },

        // SLUG
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        // CATEGORY
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        // PRODUCT IMAGES & COLOR VARIANTS
        colorVariants: [
            {
                colorName: {
                    type: String,
                    trim: true,
                },
                colorCode: {
                    type: String,
                    trim: true,
                    default: "",
                },
                secondaryColorCode: {
                    type: String,
                    trim: true,
                    default: "",
                },
                colorMode: {
                    type: String,
                    enum: ["name", "hex", "dual"],
                    default: "name",
                },
                images: [
                    {
                        url: {
                            type: String,
                            required: true,
                        },

                        imageField: {
                            type: String,
                            required: true,
                        },

                        imageType: {
                            type: String,
                            enum: ["png", "infographic"],
                            default: "png",
                        },
                    },
                ],
            }
        ],

        // PRICING
        oldPrice: {
            type: Number,
            required: true,
        },

        realPrice: {
            type: Number,
            required: true,
        },

        // SHORT DESCRIPTION
        shortDescription: {
            type: String,
            required: true,
            trim: true,
        },

        // LONG DESCRIPTION
        longDescription: {
            type: String,
            required: true,
        },

        // KEY FEATURES
        keyfeatures: {
            type: String,
            trim: true,
        },

        // APPLICATION
        application: {
            type: String,
            trim: true,
        },

        // WHY CHOOSE ASTRIDE
        whychoose: {
            type: String,
            trim: true,
        },

        // VIDEO LINKS
        videoLinks: [
            {
                type: String,
                trim: true,
            },
        ],

        // SPECIFICATIONS
        specifications: [
            {
                key: {
                    type: String,
                    trim: true,
                },

                value: {
                    type: String,
                    trim: true,
                },
            },
        ],
        // CHAIR ADJUSTABILITY SPECIFICATIONS
        chairSpecs: [
            {
                key: {
                    type: String,
                    trim: true,
                },
                value: {
                    type: String,
                    trim: true,
                },
            },
        ],

        // SEO
        metaTitle: {
            type: String,
            trim: true,
        },

        metaDescription: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;