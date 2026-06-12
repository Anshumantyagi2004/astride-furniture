"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { UploadCloud, Tag, Trash2, Pencil, X } from "lucide-react";
import Sidebar from "@/components/Admin/Sidebar";
import axios from "axios";
import toast from "react-hot-toast";

export default function Page() {
    const [categoryName, setCategoryName] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");


    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const getCategories = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/category");

            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            const { data } = await axios.delete(`/api/category?id=${id}`);
            if (data.success) {
                toast.success("Category deleted successfully");
                getCategories();
                if (editingId === id) {
                    cancelEdit();
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete category");
        }
    };

    const handleEdit = (category) => {
        setEditingId(category._id);
        setCategoryName(category.name);
        setImagePreview(category.image);
        setImageFile(null);
        // LOAD METADATA VALUES:
        setMetaTitle(category.metaTitle || "");
        setMetaDescription(category.metaDescription || "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const cancelEdit = () => {
        setEditingId(null);
        setCategoryName("");
        setImageFile(null);
        setImagePreview(null);
        // CLEAR METADATA STATES:
        setMetaTitle("");
        setMetaDescription("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", categoryName);

            // APPEND METADATA INPUTS:
            formData.append("metaTitle", metaTitle);
            formData.append("metaDescription", metaDescription);
            
            if (editingId) {
                formData.append("id", editingId);
                if (imageFile) {
                    formData.append("image", imageFile);
                }
                const { data } = await axios.put("/api/category", formData);
                if (data.success) {
                    toast.success("Category Updated Successfully");
                    getCategories();
                    cancelEdit();
                } else {
                    toast.error(data.message);
                }
            } else {
                if (!imageFile) {
                    toast.error("Please upload an image for the category");
                    return;
                }
                formData.append("image", imageFile);
                const { data } = await axios.post("/api/category", formData);
                if (data.success) {
                    toast.success("Category Added Successfully");
                    getCategories();
                    setCategoryName("");
                    setImageFile(null);
                    setImagePreview(null);
                    setMetaTitle("");
                    setMetaDescription("");
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex md:flex-row flex-col">
            <Sidebar />

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6">
                <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8">
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold text-gray-800">
                                {editingId ? "Edit Category" : "Add Category"}
                            </h1>
                            {editingId && (
                                <button
                                    onClick={cancelEdit}
                                    className="flex items-center gap-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-full font-semibold transition"
                                >
                                    <X size={14} />
                                    Cancel Edit
                                </button>
                            )}
                        </div>

                        <p className="text-gray-500 mt-2">
                            {editingId ? "Update category details and image" : "Create a new category with name and image"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category Name
                            </label>

                            <div className="relative text-black">
                                <Tag
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                                    size={20}
                                />

                                <input
                                    type="text"
                                    placeholder="Enter category name"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-400 rounded-lg outline-none focus:ring-1 focus:ring-black"
                                    required
                                />
                            </div>
                        </div>
                        {/* Meta Title Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                SEO Meta Title
                            </label>
                            <input
                                type="text"
                                placeholder="Enter meta title (e.g. Office Chairs | Astride)"
                                value={metaTitle}
                                onChange={(e) => setMetaTitle(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-400 rounded-lg outline-none text-black focus:ring-1 focus:ring-black"
                            />
                        </div>
                        {/* Meta Description Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                SEO Meta Description
                            </label>
                            <textarea
                                placeholder="Enter meta description details..."
                                value={metaDescription}
                                onChange={(e) => setMetaDescription(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-400 rounded-lg outline-none text-black focus:ring-1 focus:ring-black"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category Image
                            </label>

                            <label className="border-2 border-dashed border-gray-300 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-black transition">
                                <UploadCloud
                                    className="text-gray-600 mb-3"
                                    size={40}
                                />

                                <p className="text-gray-600 font-medium">
                                    {editingId ? "Click to change category image" : "Click to upload image"}
                                </p>

                                <span className="text-sm text-gray-400 mt-1">
                                    PNG, JPG, JPEG
                                </span>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>

                            {/* IMAGE PREVIEW */}
                            {imagePreview && (
                                <div className="mt-5">
                                    <p className="text-sm font-semibold text-gray-700 mb-3">
                                        Preview
                                    </p>

                                    <div className="relative w-full h-64 rounded-3xl overflow-hidden border">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>



                        <div className="flex gap-4">
                            <button type="submit"
                                className="w-full bg-black text-white py-3 rounded-2xl font-semibold hover:opacity-90 transition"
                            >
                                {editingId ? "Update Category" : "Add Category"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <main className="flex-1 p-6">
                <div className="mb-2">
                    <h2 className="text-2xl font-bold text-black">
                        All Categories
                    </h2>
                </div>

                {loading ? (
                    <p className="text-gray-800">
                        Loading...
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {categories.map((category) => (
                            <div key={category._id}
                                className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-200"
                            >
                                <div className="relative h-52 w-full">
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="px-5 py-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-black">
                                                {category.name}
                                            </h3>

                                            <p className="text-sm text-gray-500 mt-1">
                                                {category.slug}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEdit(category)}
                                                className="p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                                title="Edit Category"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button onClick={() => deleteCategory(category._id)}
                                                className="p-3 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition"
                                                title="Delete Category"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}