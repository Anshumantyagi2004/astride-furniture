import mongoose from "mongoose";
const ContactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "closed"],
      default: "pending",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
delete mongoose.models.Contact;
export default mongoose.models.Contact || mongoose.model("Contact", ContactSchema);