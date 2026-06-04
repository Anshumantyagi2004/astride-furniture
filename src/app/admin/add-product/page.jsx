"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "@/components/Admin/Sidebar";
import {
    Package,
    IndianRupee,
    UploadCloud,
    Plus,
    Trash2,
    Link2,
    FileText,
    X,
} from "lucide-react";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function Page() {
    // PRODUCT DATA
    const [productName, setProductName] = useState("");
    const [loading, setLoading] = useState(false);
    const [shortDescription, setShortDescription] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [oldPrice, setOldPrice] = useState("");
    const [realPrice, setRealPrice] = useState("");
    const [category, setCategory] = useState("");
    const [colorVariants, setColorVariants] = useState([
        {
            colorName: "",
            images: [],
            previews: [],
        },
    ]);
    const [videoLinks, setVideoLinks] = useState([""]);
    const [categories, setCategories] = useState([]);

    // SPECS
    const [specifications, setSpecifications] = useState([
        { key: "", value: "", },
    ]);

    // JODIT CONFIG
    const editorConfig = useMemo(() => {
        return {
            readonly: false,
            height: 350,
        };
    }, []);

    const addColorVariant = () => {
        const lastVariant = colorVariants[colorVariants.length - 1];

        if (!lastVariant.colorName.trim()) {
            toast.error("Please enter previous color name first");
            return;
        }

        setColorVariants([
            ...colorVariants,
            {
                colorName: "",
                images: [],
                previews: [],
            },
        ]);
    };

    const removeColorVariant = (index) => {
        const updated = [...colorVariants];
        updated.splice(index, 1);
        setColorVariants(updated);
    };

    const removeVariantImage = (variantIndex, imageIndex) => {
        const updated = [...colorVariants];

        updated[variantIndex].images.splice(imageIndex, 1);
        updated[variantIndex].previews.splice(imageIndex, 1);

        setColorVariants(updated);
    };

    const handleColorChange = (index, value) => {
        const updated = [...colorVariants];
        updated[index].colorName = value;
        setColorVariants(updated);
    };

    // IMAGE CHANGE
    const handleImageChange = (index, e) => {
        const files = Array.from(e.target.files);

        const updated = [...colorVariants];

        updated[index].images = files;
        updated[index].previews = files.map((file) =>
            URL.createObjectURL(file)
        );

        setColorVariants(updated);
    };

    // VIDEO LINKS
    const addVideoLink = () => {
        // CHECK LAST FIELD
        const lastLink = videoLinks[videoLinks.length - 1];

        if (!lastLink.trim()) {
            toast.error("Please fill the previous video link first");
            return;
        }

        setVideoLinks([...videoLinks, ""]);
    };

    const removeVideoLink = (index) => {
        const updated = [...videoLinks];
        updated.splice(index, 1);
        setVideoLinks(updated);
    };

    const handleVideoChange = (index, value) => {
        const updated = [...videoLinks];
        updated[index] = value;
        setVideoLinks(updated);
    };

    // SPECS
    const addSpecification = () => {
        // GET LAST SPEC
        const lastSpec = specifications[specifications.length - 1];

        // VALIDATION
        if (!lastSpec.key.trim() || !lastSpec.value.trim()) {
            toast.error("Please fill previous specification first");
            return;
        }

        setSpecifications([
            ...specifications,
            { key: "", value: "", },
        ]);
    };

    const removeSpecification = (index) => {
        const updated = [...specifications];
        updated.splice(index, 1);
        setSpecifications(updated);
    };

    const handleSpecChange = (index, field, value) => {
        const updated = [...specifications];
        updated[index][field] = value;
        setSpecifications(updated);
    };

    // SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("productName", productName);
            formData.append("shortDescription", shortDescription);
            formData.append("longDescription", longDescription);
            formData.append("oldPrice", oldPrice);
            formData.append("realPrice", realPrice);
            formData.append("category", category);
            formData.append("videoLinks", JSON.stringify(videoLinks));
            formData.append("specifications", JSON.stringify(specifications));

            // MULTIPLE IMAGES
            const colorData = colorVariants.map((variant) => ({
                colorName: variant.colorName,
                imageCount: variant.images.length,
            }));

            formData.append("colorVariants", JSON.stringify(colorData));
            colorVariants.forEach((variant, variantIndex) => {
                variant.images.forEach((image) => {
                    formData.append(
                        `variant_${variantIndex}`,
                        image
                    );
                });
            });

            const { data } = await axios.post("/api/product", formData);
            if (data.success) {
                toast.success("Product Added Successfully");
                console.log(data);
                setProductName()
                setShortDescription()
                setLongDescription()
                setOldPrice()
                setRealPrice()
                setCategory()
                setVideoLinks([""])
                setSpecifications([
                    { key: "", value: "", },
                ])
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const getCategories = async () => {
        try {
            const { data } = await axios.get("/api/category");

            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch categories");
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />

            <main className="flex-1 md:p-6 p-4">
                <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg md:p-8 p-4">
                    <div className="mb-5 flex justify-center flex-col items-center">
                        <h1 className="text-3xl font-bold text-black">
                            Add Product
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Create product with images,
                            pricing, videos and
                            specifications
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Product Name
                                </label>

                                <div className="relative">
                                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />

                                    <input
                                        type="text"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        placeholder="Enter product name"
                                        className="w-full border border-gray-400 rounded-lg py-2 pl-12 pr-4 outline-none focus:ring-1 focus:ring-black text-black"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Category
                                </label>

                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full border border-gray-400 rounded-lg py-2.5 px-4 outline-none focus:ring-1 focus:ring-black text-black"
                                >
                                    <option value="">
                                        Select Category
                                    </option>

                                    {categories.map((category, index) => (
                                        <option key={index} value={category?._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* PRICES */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Old Price
                                </label>

                                <div className="relative">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />

                                    <input
                                        type="number"
                                        value={oldPrice}
                                        onChange={(e) => setOldPrice(e.target.value)}
                                        placeholder="999"
                                        className="w-full border border-gray-400 rounded-lg py-2 pl-12 pr-4 outline-none focus:ring-1 focus:ring-black text-black"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Real Price
                                </label>

                                <div className="relative">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />

                                    <input
                                        type="number"
                                        value={realPrice}
                                        onChange={(e) => setRealPrice(e.target.value)}
                                        placeholder="799"
                                        className="w-full border border-gray-400 rounded-lg py-2 pl-12 pr-4 outline-none focus:ring-1 focus:ring-black text-black"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SHORT DESCRIPTION */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Short Description
                            </label>

                            <textarea
                                rows={4}
                                value={shortDescription}
                                onChange={(e) => setShortDescription(e.target.value)}
                                placeholder="Write short description"
                                className="w-full border border-gray-400 rounded-lg p-4 outline-none focus:ring-1 focus:ring-black text-black"
                            />
                        </div>

                        {/* LONG DESCRIPTION */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Long Description
                            </label>

                            <div className="text-black">
                                <JoditEditor
                                    value={longDescription}
                                    config={editorConfig}
                                    onBlur={(newContent) => setLongDescription(newContent)}
                                />
                            </div>
                        </div>

                        {/* SPECIFICATIONS */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-sm font-semibold text-gray-700">
                                    Product Specifications
                                </label>

                                <button type="button" onClick={addSpecification}
                                    className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    Add Spec
                                </button>
                            </div>

                            <div className="space-y-4">
                                {specifications.map((spec, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={spec.key}
                                            onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                                            placeholder="RAM"
                                            className="border border-gray-400 rounded-lg py-2 px-4 outline-none focus:ring-1 focus:ring-black text-black"
                                        />

                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                value={spec.value}
                                                onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                                                placeholder="16GB"
                                                className="flex-1 border border-gray-400 rounded-lg py-2 px-4 outline-none focus:ring-1 focus:ring-black text-black"
                                            />

                                            <button type="button" onClick={() => removeSpecification(index)}
                                                className="bg-red-100 hover:bg-red-200 text-red-600 px-3 rounded-md"
                                            >
                                                <Trash2
                                                    size={18}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                )
                                )}
                            </div>
                        </div>

                        {/* MULTIPLE IMAGES */}
                        <div className="space-y-4">
                            {/* HEADER */}
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-gray-700">
                                    Product Color Variants
                                </label>

                                <button
                                    type="button"
                                    onClick={addColorVariant}
                                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition"
                                >
                                    <Plus size={16} />
                                    Add Color Variant
                                </button>
                            </div>

                            {colorVariants.map((variant, index) => (
                                <div
                                    key={index}
                                    className="border rounded-2xl p-5 bg-white shadow-sm space-y-4"
                                >

                                    {/* TOP BAR */}
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-700">
                                            Variant #{index + 1}
                                        </h3>

                                        {colorVariants.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeColorVariant(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>

                                    {/* COLOR NAME */}
                                    <input
                                        type="text"
                                        placeholder="Color Name (Black, Blue, Red...)"
                                        value={variant.colorName}
                                        onChange={(e) =>
                                            handleColorChange(index, e.target.value)
                                        }
                                        className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                                    />

                                    {/* IMAGE UPLOAD */}
                                    <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-black transition">

                                        <UploadCloud
                                            size={32}
                                            className="text-gray-500 mb-2"
                                        />

                                        <p className="text-sm text-gray-600">
                                            Upload Images for {variant.colorName || "this color"}
                                        </p>

                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleImageChange(index, e)
                                            }
                                            className="hidden"
                                        />
                                    </label>

                                    {/* PREVIEW */}
                                    {variant.previews.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {variant.previews.map((image, i) => (
                                                <div
                                                    key={i}
                                                    className="relative h-32 rounded-xl overflow-hidden border"
                                                >
                                                    <Image
                                                        src={image}
                                                        alt="Preview"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeVariantImage(index, i)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* VIDEO LINKS */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-sm font-semibold text-gray-700">
                                    Video Links
                                </label>

                                <button type="button" onClick={addVideoLink}
                                    className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    Add Link
                                </button>
                            </div>

                            <div className="space-y-4">
                                {videoLinks.map((link, index) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="relative flex-1">
                                            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />

                                            <input
                                                type="text"
                                                value={link}
                                                onChange={(e) => handleVideoChange(index, e.target.value)}
                                                placeholder="Paste video link"
                                                className="w-full border border-gray-400 rounded-lg py-2 pl-12 pr-4 outline-none focus:ring-1 focus:ring-black text-black"
                                            />
                                        </div>

                                        <button type="button" onClick={() => removeVideoLink(index)}
                                            className="bg-red-100 hover:bg-red-200 text-red-600 px-3 rounded-md"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SUBMIT */}
                        <button type="submit" disabled={loading}
                            className="w-full bg-black text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition"
                        >
                            {loading ? "Adding Product..." : "Add Product"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}