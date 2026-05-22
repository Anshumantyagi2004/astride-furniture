import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        image: {
            type: String,
            required: true,
        },

        imageField: {
            type: String,
            default: "",
            trim: true,
        },

        metaTitle: {
            type: String,
            default: "",
            trim: true,
        },

        metaDescription: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;