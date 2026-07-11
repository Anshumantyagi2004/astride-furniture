import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    shippingInfo: {
      fullName: String,
      email: String,
      phone: String,

      address: String,
      city: String,
      state: String,
      pinCode: String,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.Mixed, // accepts ObjectId string or any format — prevents CastError
          ref: "Product",
        },

        productName: String,
        image: String,
        slug: String,
        color: String,
        quantity: Number,
        price: Number,
      },
    ],

    pricing: {
      subtotal: Number,
      shippingCharge: {
        type: Number,
        default: 0,
      },
      total: Number,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    razorpayOrderId: {
      type: String,
    },

    razorpayPaymentId: {
      type: String,
    },

    razorpaySignature: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Processing", "Processing / Packing","Dispatched","Shipped", "Out for Delivery", "Delivered", "Cancelled", "Return Requested", "Return Approved", "Return Rejected", 
    "Refund Initiated", "Refunded"],
      default: "Confirmed",
    },

    cancelledByUser: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true,
  }
);

delete mongoose.models.Order;
const Order = mongoose.model("Order", orderSchema);

export default Order;