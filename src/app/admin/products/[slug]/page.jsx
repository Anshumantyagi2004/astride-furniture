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
    ArrowLeft,
    ArrowRight,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const COLOR_MAP = {
  black: '#000000',
  white: '#ffffff',
  red: '#dc2626',
  blue: '#2563eb',
  grey: '#4b5563',
  gray: '#4b5563',
  orange: '#ea580c',
  green: '#16a34a',
  yellow: '#ca8a04',
  pink: '#db2777',
  purple: '#9333ea',
  brown: '#7c2d12',
  maroon: '#800000',
  mahroon: '#800000',
  navy: '#000080',
  teal: '#008080',
  beige: '#f5f5dc',
  cream: '#fffdd0',
  gold: '#ffd700',
  silver: '#c0c0c0',
  'neon green': '#39ff14',
};

const getAdminSwatchBackground = (variant) => {
  const mode = variant.colorMode || (variant.secondaryColorCode ? "dual" : (variant.colorCode && variant.colorCode.trim() !== "") ? "hex" : "name");

  if (mode === "dual" && variant.colorCode && variant.secondaryColorCode) {
    return `linear-gradient(135deg, ${variant.colorCode} 50%, ${variant.secondaryColorCode} 50%)`;
  }
  if (mode === "hex" && variant.colorCode && variant.colorCode.trim() !== "") {
    return variant.colorCode;
  }
  const normalized = (variant.colorName || "").toLowerCase().trim();
  if (COLOR_MAP[normalized]) return COLOR_MAP[normalized];
  return normalized || '#cccccc';
};

export default function Page() {
    // PRODUCT DATA
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [categories, setCategories] = useState([]);
    const [productName, setProductName] = useState("");
    const [slugValue, setSlugValue] = useState("");
    const [shortDescription, setShortDescription,] = useState("");
    const [longDescription, setLongDescription,] = useState("");
    const [keyfeatures, setKeyfeatures] = useState("");
    const [application, setApplication] = useState("");
    const [whychoose, setWhychoose] = useState("");
    const [oldPrice, setOldPrice] = useState("");
    const [realPrice, setRealPrice] = useState("");
    const [category, setCategory] = useState("");
    const [colorVariants, setColorVariants] = useState([
        {
            colorName: "",
            images: [],
            existingImages: [],
            previews: [],
        },
    ]);
    const [videoLinks, setVideoLinks] = useState([""]);
    const [specifications, setSpecifications,] = useState([
        { key: "", value: "", },
    ]);
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [chairSpecs, setChairSpecs] = useState([
        { key: "Seat height", value: "18\" - 22\"" },
        { key: "Armrest height", value: "6\" - 10\"" },
        { key: "Weight capacity", value: "135 kg" },
        { key: "Recline lock", value: "4 positions" }
    ]);

    const editorConfig = useMemo(() => {
        return { readonly: false, height: 350, };
    }, []);

    const getProduct = async () => {
        setLoading(true);
        let retries = 3;
        while (retries > 0) {
            try {
                const { data } = await axios.get(`/api/product/${params.slug}`);

                if (data.success) {
                    const product = data.product;
                    setProductName(product.productName);
                    setSlugValue(product.slug || "");
                    setShortDescription(product.shortDescription);
                    setLongDescription(product.longDescription);
                    setKeyfeatures(product.keyfeatures || "");
                    setApplication(product.application || "");
                    setWhychoose(product.whychoose || "");
                    setOldPrice(product.oldPrice);
                    setRealPrice(product.realPrice);
                    setCategory(product.category?._id);
                    setMetaTitle(product.metaTitle || "");
                    setMetaDescription(product.metaDescription || "");
                    setVideoLinks(product.videoLinks?.length ? product.videoLinks : [""]);
                    setSpecifications(product.specifications
                        ?.length ? product.specifications : [{ key: "", value: "", },
                    ]);
                    setChairSpecs(product.chairSpecs?.length ? product.chairSpecs : [
                        { key: "Seat height", value: "18\" - 22\"" },
                        { key: "Armrest height", value: "6\" - 10\"" },
                        { key: "Weight capacity", value: "135 kg" },
                        { key: "Recline lock", value: "4 positions" }
                    ]);
                    setColorVariants(
                        product.colorVariants?.length
                            ? product.colorVariants.map((variant) => ({
                                colorName: variant.colorName,
                                colorCode: variant.colorCode || "",
                                secondaryColorCode: variant.secondaryColorCode || "",
                                colorMode: variant.colorMode || (variant.secondaryColorCode ? "dual" : (variant.colorCode && variant.colorCode.trim() !== "") ? "hex" : "name"),
                                images: [],
                                existingImages: (variant.images || []).map(img => ({
                                    ...img,
                                    imageType: img.imageType || "png"
                                })),
                                previews: (variant.images || []).map((img) => ({
                                    url: img.url,
                                    imageType: img.imageType || "png"
                                })),
                            }))
                            : [
                                {
                                    colorName: "",
                                    colorCode: "",
                                    secondaryColorCode: "",
                                    images: [],
                                    existingImages: [],
                                    previews: [],
                                },
                            ]
                    );
                    setLoading(false);
                    return; // exit if successful
                }
            } catch (error) {
                console.log(`Fetch failed (Retries left: ${retries - 1})...`, error);
                retries--;
                if (retries === 0) {
                    toast.error("Failed to fetch product");
                } else {
                    // Wait 1.5 seconds before retrying
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
            }
        }
        setLoading(false);
    };

    // GET CATEGORIES
    const getCategories = async () => {
        try {
            const { data } = await axios.get("/api/category");

            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getProduct();
        getCategories();
    }, []);

    const addColorVariant = () => {
        const lastVariant =
            colorVariants[colorVariants.length - 1];

        if (!lastVariant.colorName.trim()) {
            toast.error(
                "Please enter previous color name first"
            );
            return;
        }

        setColorVariants([
            ...colorVariants,
            {
                colorName: "",
                colorCode: "",
                secondaryColorCode: "",
                images: [],
                existingImages: [],
                previews: [],
            },
        ]);
    };

    const removeColorVariant = (index) => {
        const updated = [...colorVariants];

        updated.splice(index, 1);

        setColorVariants(updated);
    };

    const handleColorChange = (index, field, value) => {
        const updated = [...colorVariants];

        updated[index][field] = value;

        setColorVariants(updated);
    };

    // IMAGE CHANGE WITH AUTO-CONVERSION TO WEBP
    const handleImageChange = async (index, e) => {
        const files = Array.from(e.target.files);

        const convertToWebP = (file) => {
            return new Promise((resolve, reject) => {


                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new window.Image();
                    img.onload = () => {
                        let width = img.width;
                        let height = img.height;
                        const MAX_SIZE = 800;
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
                        if (!ctx) { resolve(file); return; }
                        ctx.drawImage(img, 0, 0, width, height);
                        canvas.toBlob((blob) => {
                            if (!blob) { resolve(file); return; }
                            const webpFile = new File([blob], `${file.name.replace(/\.[^/.]+$/, "")}.webp`, { type: "image/webp" });
                            webpFile.originalSize = file.size; // Store original size
                            resolve(webpFile);
                        }, "image/webp", 0.70);
                    };
                    img.onerror = () => reject(new Error("Failed to load image"));
                    img.src = event.target.result;
                };
                reader.onerror = () => reject(new Error("Failed to read image file"));
                reader.readAsDataURL(file);
            });
        };

        try {
            const webpFiles = await Promise.all(files.map((file) => convertToWebP(file)));
            const updated = [...colorVariants];

            updated[index].images = [...updated[index].images, ...webpFiles];
            updated[index].previews = [
                ...updated[index].previews,
                ...webpFiles.map((file) => ({
                    url: URL.createObjectURL(file),
                    originalSize: file.originalSize || file.size,
                    newSize: file.size,
                    imageType: "png",
                }))
            ];

            setColorVariants(updated);
        } catch (error) {
            console.error("Error converting images client-side:", error);
            toast.error(`Image processing failed: ${error.message}`);
        }
    };

    const removeVariantImage = (variantIndex, imageIndex) => {
        const updated = [...colorVariants];
        const previewItem = updated[variantIndex].previews[imageIndex];
        const previewUrl = typeof previewItem === "object" ? previewItem.url : previewItem;

        updated[variantIndex].previews.splice(imageIndex, 1);

        if (previewUrl && previewUrl.startsWith("blob:")) {
            const existingCount = updated[variantIndex].existingImages?.length || 0;
            const newFileIndex = imageIndex - existingCount;
            if (newFileIndex >= 0) {
                updated[variantIndex].images.splice(newFileIndex, 1);
            }
        } else {
            const oldImageIndex = updated[variantIndex].existingImages?.findIndex(img => img.url === previewUrl);
            if (oldImageIndex !== undefined && oldImageIndex >= 0) {
                updated[variantIndex].existingImages.splice(oldImageIndex, 1);
            }
        }

        setColorVariants(updated);
    };

    // VIDEO
    const addVideoLink = () => {
        const last = videoLinks[videoLinks.length - 1];

        if (!last.trim()) {
            toast.error("Fill previous link first");
            return;
        }

        setVideoLinks([...videoLinks, "",]);
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

    // CHAIR SPECS
    const addChairSpecification = () => {
        const lastSpec = chairSpecs[chairSpecs.length - 1];
        if (lastSpec && (!lastSpec.key.trim() || !lastSpec.value.trim())) {
            toast.error("Please fill previous chair specification first");
            return;
        }
        setChairSpecs([...chairSpecs, { key: "", value: "" }]);
    };

    const removeChairSpecification = (index) => {
        const updated = [...chairSpecs];
        updated.splice(index, 1);
        setChairSpecs(updated);
    };

    const handleChairSpecChange = (index, field, value) => {
        const updated = [...chairSpecs];
        updated[index][field] = value;
        setChairSpecs(updated);
    };

    // SPECIFICATIONS
    const addSpecification = () => {
        const last = specifications[specifications.length - 1];

        if (!last.key.trim() || !last.value.trim()) {
            toast.error("Fill previous specification first");
            return;
        }

        setSpecifications([
            ...specifications,
            { key: "", value: "", },
        ]);
    };

    const removeSpecification = (index) => {
        const updated = [...specifications,];

        updated.splice(index, 1);
        setSpecifications(updated);
    };

    const moveVariantImage = (variantIndex, imageIndex, direction) => {
        const updated = [...colorVariants];
        const targetIndex = direction === "left" ? imageIndex - 1 : imageIndex + 1;
        const total = updated[variantIndex].previews?.length || 0;
        
        if (targetIndex < 0 || targetIndex >= total) return;

        // Swap previews
        const tempPreview = updated[variantIndex].previews[imageIndex];
        updated[variantIndex].previews[imageIndex] = updated[variantIndex].previews[targetIndex];
        updated[variantIndex].previews[targetIndex] = tempPreview;

        // Swap images if present
        if (updated[variantIndex].images && updated[variantIndex].images.length > 0) {
            const tempImg = updated[variantIndex].images[imageIndex];
            updated[variantIndex].images[imageIndex] = updated[variantIndex].images[targetIndex];
            updated[variantIndex].images[targetIndex] = tempImg;
        }

        // Swap existingImages if present
        if (updated[variantIndex].existingImages && updated[variantIndex].existingImages.length > 0) {
            const tempExist = updated[variantIndex].existingImages[imageIndex];
            updated[variantIndex].existingImages[imageIndex] = updated[variantIndex].existingImages[targetIndex];
            updated[variantIndex].existingImages[targetIndex] = tempExist;
        }

        setColorVariants(updated);
    };

    // UPDATE
    const toggleImageType = (variantIndex, imageIndex) => {
        const updated = [...colorVariants];
        const previewItem = updated[variantIndex].previews[imageIndex];
        const currentType = typeof previewItem === "object" && previewItem.imageType ? previewItem.imageType : "png";
        const newType = currentType === "infographic" ? "png" : "infographic";

        if (typeof previewItem === "object") {
            updated[variantIndex].previews[imageIndex].imageType = newType;
        } else {
            updated[variantIndex].previews[imageIndex] = {
                url: previewItem,
                imageType: newType,
            };
        }

        const existingCount = updated[variantIndex].existingImages?.length || 0;
        if (imageIndex < existingCount) {
            if (updated[variantIndex].existingImages[imageIndex]) {
                updated[variantIndex].existingImages[imageIndex].imageType = newType;
            }
        }

        setColorVariants(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setUpdating(true);
            const formData = new FormData();
            formData.append("productName", productName);
            if (slugValue) formData.append("slug", slugValue);
            formData.append("shortDescription", shortDescription);
            formData.append("longDescription", longDescription);
            formData.append("keyfeatures", keyfeatures);
            formData.append("application", application);
            formData.append("whychoose", whychoose);
            formData.append("oldPrice", oldPrice);
            formData.append("realPrice", realPrice);
            formData.append("category", category);
            formData.append("metaTitle", metaTitle);
            formData.append("metaDescription", metaDescription);
            formData.append("videoLinks", JSON.stringify(videoLinks));
            formData.append("specifications", JSON.stringify(specifications));
            formData.append("chairSpecs", JSON.stringify(chairSpecs));
            const colorData = colorVariants.map(
                (variant) => {
                    const existingCount = variant.existingImages?.length || 0;
                    const newImageTypes = variant.previews.slice(existingCount).map(p => typeof p === "object" ? p.imageType || "png" : "png");

                    const mode = variant.colorMode || (variant.secondaryColorCode ? "dual" : (variant.colorCode && variant.colorCode.trim() !== "") ? "hex" : "name");
                    return {
                        colorName: variant.colorName,
                        colorCode: mode === "name" ? "" : (variant.colorCode || ""),
                        secondaryColorCode: mode === "dual" ? (variant.secondaryColorCode || "") : "",
                        colorMode: mode,
                        imageCount: variant.images.length,
                        existingImages: (variant.existingImages || []).map(img => ({
                            url: img.url,
                            imageField: img.imageField,
                            imageType: img.imageType || "png",
                        })),
                        newImageTypes: newImageTypes,
                    };
                }
            );

            formData.append(
                "colorVariants",
                JSON.stringify(colorData)
            );

            colorVariants.forEach(
                (variant, variantIndex) => {
                    variant.images.forEach((image) => {
                        formData.append(
                            `variant_${variantIndex}`,
                            image
                        );
                    });
                }
            );

            const { data } = await axios.put(`/api/product/${params.slug}`, formData);
            if (data.success) {
                toast.success("Product updated successfully");
                if (typeof window !== "undefined") {
                    sessionStorage.removeItem("astride_products_cache");
                    sessionStorage.removeItem("astride_nav_products_cache");
                    sessionStorage.removeItem("astride_bestsellers_cache");
                    sessionStorage.removeItem("astride_nav_categories_cache");
                }
                router.push("/admin/products");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-800">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />

            <main className="flex-1 md:p-6 p-4">
                <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg md:p-8 p-4">
                    <div className="mb-5 flex justify-center flex-col items-center">
                        <h1 className="text-3xl font-bold text-black">
                            Edit Product
                        </h1>
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

                            {/* CUSTOM SLUG INPUT */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Product Slug
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={slugValue}
                                        onChange={(e) => setSlugValue(e.target.value)}
                                        placeholder="Product slug"
                                        className="w-full border border-gray-400 rounded-lg py-2 px-4 outline-none focus:ring-1 focus:ring-black text-black"
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
                                        onWheel={(e) => e.target.blur()}
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
                                        onWheel={(e) => e.target.blur()}
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

                        {/* SEO META FIELDS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    SEO Meta Title
                                </label>
                                <input
                                    type="text"
                                    value={metaTitle}
                                    onChange={(e) => setMetaTitle(e.target.value)}
                                    placeholder="Enter meta title (e.g. Office Chair | Astride)"
                                    className="w-full border border-gray-400 rounded-lg py-2 px-4 outline-none focus:ring-1 focus:ring-black text-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    SEO Meta Description
                                </label>
                                <textarea
                                    rows={1}
                                    value={metaDescription}
                                    onChange={(e) => setMetaDescription(e.target.value)}
                                    placeholder="Enter meta description details..."
                                    className="w-full border border-gray-400 rounded-lg py-2 px-4 outline-none focus:ring-1 focus:ring-black text-black"
                                />
                            </div>
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

                        {/* KEY FEATURES */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Key Features
                            </label>

                            <div className="text-black">
                                <JoditEditor
                                    value={keyfeatures}
                                    config={editorConfig}
                                    onBlur={(newContent) => setKeyfeatures(newContent)}
                                />
                            </div>
                        </div>

                        {/* APPLICATION */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Application
                            </label>

                            <div className="text-black">
                                <JoditEditor
                                    value={application}
                                    config={editorConfig}
                                    onBlur={(newContent) => setApplication(newContent)}
                                />
                            </div>
                        </div>

                        {/* WHY CHOOSE ASTRIDE */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Why Choose Astride
                            </label>

                            <div className="text-black">
                                <JoditEditor
                                    value={whychoose}
                                    config={editorConfig}
                                    onBlur={(newContent) => setWhychoose(newContent)}
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

                        {/* CHAIR SPECIFICATIONS */}
                        <div>
                            <div className="flex items-center justify-between mb-4 mt-8">
                                <label className="text-sm font-semibold text-gray-700">
                                    Chair Adjustability Specifications
                                </label>

                                <button type="button" onClick={addChairSpecification}
                                    className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    Add Spec
                                </button>
                            </div>

                            <div className="space-y-4">
                                {chairSpecs.map((spec, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={spec.key}
                                            onChange={(e) => handleChairSpecChange(index, "key", e.target.value)}
                                            placeholder="Seat height"
                                            className="border border-gray-400 rounded-lg py-2 px-4 outline-none focus:ring-1 focus:ring-black text-black"
                                        />

                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                value={spec.value}
                                                onChange={(e) => handleChairSpecChange(index, "value", e.target.value)}
                                                placeholder='18" - 22"'
                                                className="flex-1 border border-gray-400 rounded-lg py-2 px-4 outline-none focus:ring-1 focus:ring-black text-black"
                                            />

                                            <button type="button" onClick={() => removeChairSpecification(index)}
                                                className="bg-red-100 hover:bg-red-200 text-red-600 px-3 rounded-md"
                                            >
                                                <Trash2
                                                    size={18}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* MULTIPLE IMAGES */}
                        <div className="space-y-4">

                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-gray-700">
                                    Product Color Variants
                                </label>

                                <button
                                    type="button"
                                    onClick={addColorVariant}
                                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    Add Color Variant
                                </button>
                            </div>

                            {colorVariants.map((variant, index) => (
                                <div
                                    key={index}
                                    className="border rounded-2xl p-5 bg-gray-50"
                                >
                                    <div className="flex justify-between items-center mb-4">

                                        <h3 className="font-semibold">
                                            Variant #{index + 1}
                                        </h3>

                                        {colorVariants.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeColorVariant(index)
                                                }
                                                className="text-red-500"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                     {/* SWATCH SOURCE RADIO SELECTOR */}
                                     <div className="flex flex-wrap items-center gap-6 md:gap-8 bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 mb-3">
                                         <span className="text-gray-600 font-bold mr-1">Select Swatch Source:</span>
                                         <label className="flex items-center gap-2 cursor-pointer hover:text-black">
                                             <input
                                                 type="radio"
                                                 name={`colorMode_edit_${index}`}
                                                 checked={(variant.colorMode || (variant.secondaryColorCode ? "dual" : (variant.colorCode && variant.colorCode.trim() !== "") ? "hex" : "name")) === "name"}
                                                 onChange={() => handleColorChange(index, "colorMode", "name")}
                                                 className="accent-black w-4 h-4 cursor-pointer"
                                             />
                                             <span>Use Color Name</span>
                                         </label>

                                         <label className="flex items-center gap-2 cursor-pointer hover:text-black">
                                             <input
                                                 type="radio"
                                                 name={`colorMode_edit_${index}`}
                                                 checked={(variant.colorMode || (variant.secondaryColorCode ? "dual" : (variant.colorCode && variant.colorCode.trim() !== "") ? "hex" : "name")) === "hex"}
                                                 onChange={() => handleColorChange(index, "colorMode", "hex")}
                                                 className="accent-black w-4 h-4 cursor-pointer"
                                             />
                                             <span>Use Custom Hex / Color Picker</span>
                                         </label>

                                         <label className="flex items-center gap-2 cursor-pointer hover:text-black">
                                             <input
                                                 type="radio"
                                                 name={`colorMode_edit_${index}`}
                                                 checked={(variant.colorMode || (variant.secondaryColorCode ? "dual" : (variant.colorCode && variant.colorCode.trim() !== "") ? "hex" : "name")) === "dual"}
                                                 onChange={() => handleColorChange(index, "colorMode", "dual")}
                                                 className="accent-black w-4 h-4 cursor-pointer"
                                             />
                                             <span>Use Dual-Tone (2 Shades)</span>
                                         </label>
                                     </div>

                                     {/* COLOR NAME & CODES */}
                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                         <div>
                                             <label className="block text-xs font-semibold text-gray-600 mb-1">Color Name</label>
                                             <input
                                                 type="text"
                                                 placeholder="Color Name (e.g. Light Blue)"
                                                 value={variant.colorName}
                                                 onChange={(e) => handleColorChange(index, "colorName", e.target.value)}
                                                 className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black text-black"
                                             />
                                         </div>

                                         <div>
                                             <label className="block text-xs font-semibold text-gray-600 mb-1">Primary Color (Hex / Picker)</label>
                                             <div className="flex items-center gap-2">
                                                 <input
                                                     type="color"
                                                     value={variant.colorCode || "#000000"}
                                                     onChange={(e) => handleColorChange(index, "colorCode", e.target.value)}
                                                     className="w-9 h-9 p-0 border rounded cursor-pointer flex-shrink-0"
                                                 />
                                                 <input
                                                     type="text"
                                                     value={variant.colorCode || ""}
                                                     onChange={(e) => handleColorChange(index, "colorCode", e.target.value)}
                                                     placeholder="Optional Hex (e.g. #800000)"
                                                     className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs text-black outline-none focus:ring-1 focus:ring-black"
                                                 />
                                                 {variant.colorCode && (
                                                     <button
                                                         type="button"
                                                         onClick={() => handleColorChange(index, "colorCode", "")}
                                                         className="text-xs text-red-500 hover:underline flex-shrink-0"
                                                     >
                                                         Clear
                                                     </button>
                                                 )}
                                             </div>
                                         </div>

                                         <div>
                                             <label className="block text-xs font-semibold text-gray-600 mb-1">2nd Shade (Optional Dual-Tone)</label>
                                             <div className="flex items-center gap-2">
                                                 <input
                                                     type="color"
                                                     value={variant.secondaryColorCode || "#ffffff"}
                                                     onChange={(e) => handleColorChange(index, "secondaryColorCode", e.target.value)}
                                                     className="w-9 h-9 p-0 border rounded cursor-pointer flex-shrink-0"
                                                 />
                                                 <input
                                                     type="text"
                                                     value={variant.secondaryColorCode || ""}
                                                     onChange={(e) => handleColorChange(index, "secondaryColorCode", e.target.value)}
                                                     placeholder="Optional (e.g. #000000)"
                                                     className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs text-black outline-none focus:ring-1 focus:ring-black"
                                                 />
                                                 {variant.secondaryColorCode && (
                                                     <button
                                                         type="button"
                                                         onClick={() => handleColorChange(index, "secondaryColorCode", "")}
                                                         className="text-xs text-red-500 hover:underline flex-shrink-0"
                                                     >
                                                         Clear
                                                     </button>
                                                 )}
                                             </div>
                                         </div>
                                     </div>

                                     {/* LIVE SWATCH PREVIEW */}
                                     <div className="flex items-center gap-3 mb-4">
                                         <span className="text-xs text-gray-500 font-medium">Swatch Preview:</span>
                                         <div
                                             className="w-7 h-7 rounded-full border border-gray-300 shadow-sm flex-shrink-0"
                                             style={{
                                                 background: getAdminSwatchBackground(variant)
                                             }}
                                         />
                                         <span className="text-xs font-semibold text-gray-700">
                                             {variant.colorName || "Unnamed Variant"} {variant.secondaryColorCode ? "(Dual-Tone Split Swatch)" : ""}
                                         </span>
                                     </div>

                                    <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-black transition">

                                        <UploadCloud
                                            size={32}
                                            className="mb-2"
                                        />

                                        <p>
                                            Upload Images
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

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">

                                        {variant.previews.map((image, imageIndex) => {
                                            const isObj = typeof image === "object";
                                            const srcUrl = isObj ? image.url : image;
                                            const origSize = isObj && image.originalSize ? (image.originalSize / 1024 / 1024).toFixed(2) + " MB" : null;
                                            const newSize = isObj && image.newSize ? (image.newSize / 1024).toFixed(1) + " KB" : null;
                                            const imageType = isObj && image.imageType ? image.imageType : "png";

                                            return (
                                                <div
                                                    key={imageIndex}
                                                    className="relative h-44 rounded-xl overflow-hidden border group bg-gray-50 flex flex-col justify-between"
                                                >
                                                    <div className="relative w-full h-32">
                                                        <Image
                                                            src={srcUrl}
                                                            alt="Preview"
                                                            fill
                                                            unoptimized
                                                            className="object-cover"
                                                        />

                                                        {origSize && newSize && (
                                                            <div className="absolute top-0 left-0 bg-black/70 backdrop-blur-sm p-1.5 rounded-br-lg text-[9px] font-mono leading-tight shadow-md border-r border-b border-white/10 z-10">
                                                                <div className="text-gray-300">Orig: {origSize}</div>
                                                                <div className="text-[#34d399] font-bold">WEBP: {newSize}</div>
                                                            </div>
                                                        )}

                                                        <div className="absolute top-2 right-2 flex items-center gap-1 z-20">
                                                            {imageIndex > 0 && (
                                                                <button
                                                                    type="button"
                                                                    title="Move Left"
                                                                    onClick={() => moveVariantImage(index, imageIndex, "left")}
                                                                    className="bg-black/70 hover:bg-black text-white rounded-full p-1 shadow-md transition"
                                                                >
                                                                    <ArrowLeft size={14} />
                                                                </button>
                                                            )}
                                                            {imageIndex < (variant.previews?.length || 0) - 1 && (
                                                                <button
                                                                    type="button"
                                                                    title="Move Right"
                                                                    onClick={() => moveVariantImage(index, imageIndex, "right")}
                                                                    className="bg-black/70 hover:bg-black text-white rounded-full p-1 shadow-md transition"
                                                                >
                                                                    <ArrowRight size={14} />
                                                                </button>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeVariantImage(
                                                                        index,
                                                                        imageIndex
                                                                    )
                                                                }
                                                                className="bg-red-500 text-white rounded-full p-1 opacity-90 hover:opacity-100 shadow-md"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* TYPE TOGGLE BADGE */}
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleImageType(index, imageIndex)}
                                                        className={`w-full py-1 text-[11px] font-semibold tracking-wide transition border-t flex items-center justify-center gap-1 ${imageType === "infographic"
                                                            ? "bg-purple-600 text-white border-purple-700 hover:bg-purple-700"
                                                            : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                                                            }`}
                                                    >
                                                        {imageType === "infographic" ? "📊 Infographic" : "🖼️ Main PNG"}
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
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
                        <button type="submit" disabled={updating}
                            className="w-full bg-black text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                        >
                            {updating && (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {updating ? "Updating..." : "Update"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}