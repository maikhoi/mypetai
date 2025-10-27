import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Order from "@/models/Order";

/**
 * GET /api/orders
 * 
 * Query options:
 * - ?email=guest@example.com
 * - ?orderId=PAYPAL_ORDER_ID
 * - ?userId=YOUR_INTERNAL_USER_ID (if logged in)
 */
export async function GET(req: Request) {
    try {
      await dbConnect();
  
      const { searchParams } = new URL(req.url);
      const email = searchParams.get("email");
      const orderId = searchParams.get("orderId");
      const userId = searchParams.get("userId");
      const limit = Number(searchParams.get("limit") || 50); // pagination
      const page = Number(searchParams.get("page") || 1);
  
      const query: any = {};
      if (userId) query.userId = userId;
      if (email) query.buyerEmail = email;
      if (orderId) query.paypalOrderId = orderId;
  
      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();
  
      const total = await Order.countDocuments(query);
  
      return NextResponse.json({
        total,
        page,
        limit,
        orders,
      });
    } catch (error: any) {
      console.error("Orders fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch orders." }, { status: 500 });
    }
  }