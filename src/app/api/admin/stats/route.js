import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Product from "@/models/Product";
import Order from "@/models/order/Order";
import User from "@/models/user/User";
import Enquiry from "@/models/enquiry/Enquiry";
import Contact from "@/models/contact/Contact";

export async function GET() {
  try {
    await connectDB();

    // Get sales data for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesByDay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          paymentStatus: { $in: ["Paid", "Pending"] } // Count both completed and pending orders
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          totalSales: { $sum: "$pricing.total" },
          orderCount: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Generate 7-day chart data
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayData = salesByDay.find(d => d._id === dateStr);
      chartData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        sales: dayData ? Math.round(dayData.totalSales) : 0,
        orders: dayData ? dayData.orderCount : 0
      });
    }

    // Fetch counts and recent items in parallel
    const [
      productsCount,
      ordersCount,
      usersCount,
      inquiriesCount,
      contactsCount,
      recentInquiries,
      recentContacts,
      recentOrders,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Enquiry.countDocuments(),
      Contact.countDocuments(),
      Enquiry.find().sort({ createdAt: -1 }).limit(5),
      Contact.find().sort({ createdAt: -1 }).limit(5),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email'),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        products: productsCount,
        orders: ordersCount,
        users: usersCount,
        inquiries: inquiriesCount,
        contacts: contactsCount,
      },
      chartData,
      recentInquiries,
      recentContacts,
      recentOrders,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
