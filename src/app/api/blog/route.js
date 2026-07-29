import { NextResponse } from "next/server";
import crypto from "crypto";
import sharp from "sharp";
import connectDB from "@/config/connectDB";
import Blog from "@/models/Blog";
import { uploadToR2 } from "@/utils/uploadToR2";
import { generateSlug } from "@/utils/generateSlug";
import { verifyAdmin } from "@/lib/verifyAdmin";

export const dynamic = "force-dynamic";

// 1. POST API - Create Blog
export async function POST(req) {
  try {
    // Admin validation
    if (!verifyAdmin(req)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const formData = await req.formData();

    // Extract exact fields from form
    const title = formData.get("title");
    const permalink = formData.get("permalink"); // maps to slug
    const date = formData.get("date");
    const metaTitle = formData.get("metaTitle");
    const metaDescription = formData.get("metaDescription");
    const content = formData.get("content");
    const thumbnailFile = formData.get("thumbnail"); // File object

    // Validation
    if (!title || !content || !thumbnailFile || !date) {
      return NextResponse.json({ success: false, message: "Title, Date, Content, and Thumbnail are required" }, { status: 400 });
    }

    // Generate unique slug (permalink)
    let slug = permalink ? generateSlug(permalink) : generateSlug(title);
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      slug = `${slug}-${crypto.randomBytes(2).toString("hex")}`;
    }

    // Image compression (Sharp converts thumbnail to high-efficiency WebP)
    const arrayBuffer = await thumbnailFile.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);
    
    const compressedBuffer = await sharp(inputBuffer)
      .webp({ quality: 80 }) // 80% compression maintains high visual quality while keeping file size small
      .toBuffer();

    const fileName = `${Date.now()}-${slug}.webp`;

    // Upload to Cloudflare R2
    const uploadedImage = await uploadToR2({
      file: compressedBuffer,
      folder: "blogs",
      fileName,
      contentType: "image/webp",
    });

    // Create record in MongoDB
    const blog = await Blog.create({
      title,
      slug,
      date: new Date(date),
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || "",
      content,
      thumbnail: uploadedImage.url,
      thumbnailKey: uploadedImage.key,
    });

    return NextResponse.json({ success: true, message: "Blog created successfully", blog }, { status: 201 });
  } catch (error) {
    console.error("Create Blog Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// 2. GET API - List all Blogs OR get single blog by slug
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    // If a slug is provided, fetch only that blog
    if (slug) {
      const blog = await Blog.findOne({ slug });
      if (!blog) {
        return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, blog });
    }

    // Default: return all blogs sorted by newest created first
    const blogs = await Blog.find().sort({ createdAt: -1, date: -1, _id: -1 });
    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error("Get Blogs Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}


import { deleteFromR2 } from "@/utils/deleteFromR2";
// 3. DELETE API - Delete Blog & remove thumbnail from R2
export async function DELETE(req) {
  try {
    if (!verifyAdmin(req)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Blog ID is required" }, { status: 400 });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }
    // Delete thumbnail image from Cloudflare R2
    if (blog.thumbnailKey) {
      await deleteFromR2(blog.thumbnailKey);
    }
    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete Blog Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
// 4. PUT API - Edit / Update Blog
export async function PUT(req) {
  try {
    if (!verifyAdmin(req)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const formData = await req.formData();
    const id = formData.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Blog ID is required" }, { status: 400 });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }
    // Extract exact fields from form
    const title = formData.get("title");
    const permalink = formData.get("permalink");
    const date = formData.get("date");
    const metaTitle = formData.get("metaTitle");
    const metaDescription = formData.get("metaDescription");
    const content = formData.get("content");
    const thumbnailFile = formData.get("thumbnail"); // Optional new image
    const updateData = {
      title,
      date: date ? new Date(date) : blog.date,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || "",
      content,
    };
    if (permalink) {
      updateData.slug = generateSlug(permalink);
    }
    // If a new thumbnail is uploaded, compress it, upload it, and delete the old one
    if (thumbnailFile && thumbnailFile.size > 0) {
      // 1. Compress
      const arrayBuffer = await thumbnailFile.arrayBuffer();
      const inputBuffer = Buffer.from(arrayBuffer);
      const compressedBuffer = await sharp(inputBuffer).webp({ quality: 80 }).toBuffer();
      const fileName = `${Date.now()}-${updateData.slug || blog.slug}.webp`;
      // 2. Upload new
      const uploadedImage = await uploadToR2({
        file: compressedBuffer,
        folder: "blogs",
        fileName,
        contentType: "image/webp",
      });
      // 3. Delete old R2 image
      if (blog.thumbnailKey) {
        await deleteFromR2(blog.thumbnailKey);
      }
      updateData.thumbnail = uploadedImage.url;
      updateData.thumbnailKey = uploadedImage.key;
    }
    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json({ success: true, message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    console.error("Update Blog Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}