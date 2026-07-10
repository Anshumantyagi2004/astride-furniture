import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // Map to "Permalink"
    date: { type: Date, required: true },                 // Map to "Date"
    metaTitle: { type: String },                         // Map to "Meta Title"
    metaDescription: { type: String },                   // Map to "Meta Description"
    content: { type: String, required: true },           // Map to "Content" (Rich Text)
    thumbnail: { type: String, required: true },         // Map to "Thumbnail" (R2 URL)
    thumbnailKey: { type: String },                      // R2 Image key for future deletions
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
