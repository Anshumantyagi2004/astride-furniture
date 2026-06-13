import mongoose from "mongoose";
const EnquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
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
      default: "",
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
  },
  { timestamps: true }
);
export default mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);