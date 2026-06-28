import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/order/Order";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    // Get JWT token from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, "astride-secret-key");
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = decoded.userId;
    const orders = await Order.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    // Populate product slug from Product model for each order
    const ordersWithSlugs = await Promise.all(
      orders.map(async (order) => {
        const orderObj = order.toObject();
        
        // Convert products to plain array and add slug
        const productsWithSlugs = await Promise.all(
          orderObj.products.map(async (item: any) => {
            if (item.slug) return item; // Already has slug
            
            try {
              const product = await Product.findById(item.productId).select("slug");
              return { ...item, slug: product?.slug || item.productId };
            } catch {
              return { ...item, slug: item.productId };
            }
          })
        );
        
        // Return order with updated products
        return {
          ...orderObj,
          products: productsWithSlugs,
        };
      })
    );

    return NextResponse.json({
      success: true,
      orders: ordersWithSlugs,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    // Keep POST for backwards compatibility
    const { userId } = await req.json();

    const orders = await Order.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    // Populate product slug from Product model for each order
    const ordersWithSlugs = await Promise.all(
      orders.map(async (order) => {
        const orderObj = order.toObject();
        
        // Convert products to plain array and add slug
        const productsWithSlugs = await Promise.all(
          orderObj.products.map(async (item: any) => {
            if (item.slug) return item; // Already has slug
            
            try {
              const product = await Product.findById(item.productId).select("slug");
              return { ...item, slug: product?.slug || item.productId };
            } catch {
              return { ...item, slug: item.productId };
            }
          })
        );
        
        // Return order with updated products
        return {
          ...orderObj,
          products: productsWithSlugs,
        };
      })
    );

    return NextResponse.json({
      success: true,
      orders: ordersWithSlugs,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}