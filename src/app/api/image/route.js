import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    try {
        const res = await fetch(url);

        if (!res.ok) {
            return new NextResponse("Image not found", { status: 404 });
        }

        return new NextResponse(res.body, {
            headers: {
                "Content-Type":
                    res.headers.get("content-type") || "image/webp",
                "Cache-Control": "public, max-age=86400",
            },
        });
    } catch {
        return new NextResponse("Failed to fetch image", { status: 500 });
    }
}