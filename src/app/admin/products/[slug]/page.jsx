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
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function Page() {
    // PRODUCT DATA
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [categories, setCategories] = useState([]);
    const [productName, setProductName] = useState("");
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
            previews: [],
        },
    ]);
    const [videoLinks, setVideoLinks] = useState([""]);
    const [specifications, setSpecifications,] = useState([
        { key: "", value: "", },
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
                    setShortDescription(product.shortDescription);
                    setLongDescription(product.longDescription);
                    setKeyfeatures(product.keyfeatures || "");
                    setApplication(product.application || "");
                    setWhychoose(product.whychoose || "");
                    setOldPrice(product.oldPrice);
                    setRealPrice(product.realPrice);
                    setCategory(product.category?._id);
                    setVideoLinks(product.videoLinks?.length ? product.videoLinks : [""]);
                    setSpecifications(product.specifications
                        ?.length ? product.specifications : [{ key: "", value: "", },
                    ]);
                    setColorVariants(
                        product.colorVariants?.length
                            ? product.colorVariants.map((variant) => ({
                                colorName: variant.colorName,
                                images: [],
                                previews: variant.images.map((img) => img.url),
                            }))
                            : [
                                {
                                    colorName: "",
                                    images: [],
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

    const removeVariantImage = (
        variantIndex,
        imageIndex
    ) => {
        const updated = [...colorVariants];

        updated[variantIndex].images.splice(
            imageIndex,
            1
        );

        updated[variantIndex].previews.splice(
            imageIndex,
            1
        );

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

    const handleSpecChange = (index, field, value) => {
        const updated = [...specifications,];
        updated[index][field] = value;
        setSpecifications(updated);
    };

    // UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setUpdating(true);
            const formData = new FormData();
            formData.append("productName", productName);
            formData.append("shortDescription", shortDescription);
            formData.append("longDescription", longDescription);
            formData.append("keyfeatures", keyfeatures);
            formData.append("application", application);
            formData.append("whychoose", whychoose);
            formData.append("oldPrice", oldPrice);
            formData.append("realPrice", realPrice);
            formData.append("category", category);
            formData.append("videoLinks", JSON.stringify(videoLinks));
            formData.append("specifications", JSON.stringify(specifications));
            const colorData = colorVariants.map(
                (variant) => ({
                    colorName: variant.colorName,
                    imageCount: variant.images.length,
                })
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

                                    <input
                                        type="text"
                                        placeholder="Black, Blue, White..."
                                        value={variant.colorName}
                                        onChange={(e) =>
                                            handleColorChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        className="w-full border rounded-lg px-4 py-3 mb-4"
                                    />

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

                                        {variant.previews.map(
                                            (image, imageIndex) => (
                                                <div
                                                    key={imageIndex}
                                                    className="relative h-40 rounded-xl overflow-hidden border"
                                                >
                                                    <Image
                                                        src={image}
                                                        alt=""
                                                        fill
                                                        className="object-cover"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeVariantImage(
                                                                index,
                                                                imageIndex
                                                            )
                                                        }
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            )
                                        )}
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
                        <button type="submit"
                            className="w-full bg-black text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition"
                        >
                            {updating ? "Updating" : "Update"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}