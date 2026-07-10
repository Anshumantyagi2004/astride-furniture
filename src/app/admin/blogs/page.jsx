"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Admin/Sidebar";
import toast from "react-hot-toast";
import axios from "axios";
import { Plus, Edit2, Trash2 } from "lucide-react";

// Jodit Editor import (needs dynamic import to prevent SSR issues)
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/blog");
      if (data.success) setBlogs(data.blogs);
    } catch (err) {
      toast.error("Failed to load blogs");
    }
  };

  const deleteBlog = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(`/api/blog?id=${id}`);
      if (data.success) {
        toast.success("Blog deleted successfully!");
        fetchBlogs();
      }
    } catch (err) {
      toast.error("Failed to delete blog");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <main className="flex-1 p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Manage Blogs</h1>
            <p className="text-gray-600 mt-1">Create, edit and delete your blog posts</p>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#00badb] text-white px-5 py-2.5 rounded-xl shadow hover:bg-[#009ab5] transition duration-200"
          >
            <Plus size={20} />
            Add New Blog
          </button>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded-3xl overflow-hidden shadow p-4 space-y-4">
              <div className="h-48 w-full relative rounded-2xl overflow-hidden bg-gray-200">
                <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 line-clamp-2">{blog.title}</h3>
              {blog.metaDescription && (
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mt-1">
                  {blog.metaDescription}
                </p>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setEditingBlog(blog)}
                  className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => deleteBlog(blog._id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal component */}
        {(isModalOpen || editingBlog) && (
          <CreateBlogModal
            editingBlog={editingBlog}
            onClose={() => {
              setIsModalOpen(false);
              setEditingBlog(null);
            }}
            onRefresh={fetchBlogs}
          />
        )}
      </main>
    </div>
  );
}

// ── CREATE/EDIT BLOG MODAL COMPONENT (DEFINED IN SAME FILE) ──
function CreateBlogModal({ editingBlog, onClose, onRefresh }) {
  const [title, setTitle] = useState("");
  const [permalink, setPermalink] = useState("");
  const [date, setDate] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (editingBlog) {
      setTitle(editingBlog.title || "");
      setPermalink(editingBlog.slug || "");
      setDate(editingBlog.date ? new Date(editingBlog.date).toISOString().substring(0, 10) : "");
      setMetaTitle(editingBlog.metaTitle || "");
      setMetaDescription(editingBlog.metaDescription || "");
      setContent(editingBlog.content || "");
      setPreview(null);
    } else {
      setTitle("");
      setPermalink("");
      setDate("");
      setMetaTitle("");
      setMetaDescription("");
      setContent("");
      setThumbnail(null);
      setPreview(null);
    }
  }, [editingBlog]);

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const convertToWebP = (file) => {
      return new Promise((resolve, reject) => {
        if (file.type === "image/webp") {
          resolve(file);
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new window.Image();
          img.onload = () => {
            let width = img.width;
            let height = img.height;
            const MAX_SIZE = 1200;

            if (width > height && width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            } else if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
              resolve(file);
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  resolve(file);
                  return;
                }
                const webpFile = new File(
                  [blob],
                  `${file.name.replace(/\.[^/.]+$/, "")}.webp`,
                  { type: "image/webp" }
                );
                webpFile.originalSize = file.size;
                resolve(webpFile);
              },
              "image/webp",
              0.85
            );
          };
          img.onerror = () => reject(new Error("Failed to load image"));
          img.src = event.target.result;
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
    };

    try {
      const loadingToast = toast.loading("Converting & compressing image...");
      const webpFile = await convertToWebP(file);
      setThumbnail(webpFile);
      setPreview({
        url: URL.createObjectURL(webpFile),
        originalSize: webpFile.originalSize || file.size,
        newSize: webpFile.size,
      });
      toast.dismiss(loadingToast);
      toast.success("Compressed successfully to WebP!");
    } catch (err) {
      toast.error("Failed to process image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("permalink", permalink);
    formData.append("date", date);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("content", content);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      let res;
      if (editingBlog) {
        formData.append("id", editingBlog._id);
        res = await axios.put("/api/blog", formData);
      } else {
        res = await axios.post("/api/blog", formData);
      }

      if (res.data.success) {
        toast.success(editingBlog ? "Blog updated successfully!" : "Blog added successfully!");
        onRefresh();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save blog");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{editingBlog ? "Edit Blog" : "Create Blog"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter blog title" required className="w-full border p-2.5 rounded-xl" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Permalink</label>
              <input type="text" value={permalink} onChange={(e) => setPermalink(e.target.value)} placeholder="unique-url-slug" className="w-full border p-2.5 rounded-xl" />
              <p className="text-[10.5px] text-gray-400 mt-1">If left blank, it will automatically use the blog Title as the URL slug.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full border p-2.5 rounded-xl" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1">Meta Title</label>
            <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="SEO Meta Title" className="w-full border p-2.5 rounded-xl" />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1">Meta Description</label>
            <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Short SEO-friendly description" className="w-full border p-2.5 rounded-xl" />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1">Content</label>
            <JoditEditor value={content} onChange={(newContent) => setContent(newContent)} />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1">Thumbnail</label>
            <input type="file" accept="image/*" onChange={handleThumbnailChange} required={!editingBlog} className="w-full border p-2 rounded-xl mb-3" />
            
            {preview && (
              <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-200 group mb-3 bg-gray-50">
                <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-sm p-2.5 rounded-xl text-xs font-mono leading-tight shadow-md border border-white/10 z-10">
                  <div className="text-gray-300">Original: {(preview.originalSize / 1024 / 1024).toFixed(2)} MB</div>
                  <div className="text-[#34d399] font-bold mt-0.5">WEBP: {(preview.newSize / 1024).toFixed(1)} KB</div>
                </div>
              </div>
            )}

            {editingBlog && editingBlog.thumbnail && !preview && (
              <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-200 mb-3 bg-gray-50">
                <img src={editingBlog.thumbnail} alt="Current Thumbnail" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs text-white">
                  Current Image
                </div>
              </div>
            )}
          </div>
          
          <button type="submit" className="w-full bg-[#00badb] text-white py-3 rounded-xl hover:bg-[#009ab5]">
            {editingBlog ? "Update Blog" : "Add Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}
