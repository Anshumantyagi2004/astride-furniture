import mongoose from "mongoose";
const EnquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    companyName: {
      type: String,
      required: false,
    },
    quantity: {
      type: Number,
      required: [true, "Number of chairs is required"],
    },
    email: {
      type: String,
      required: [true, "Official email is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
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
delete mongoose.models.Enquiry;
export default mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);