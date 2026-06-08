import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        productName: String,
        image: String,
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
      default: "COD",
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

delete mongoose.models.Order;
const Order = mongoose.model("Order", orderSchema);

export default Order;