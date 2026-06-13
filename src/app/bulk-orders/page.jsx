import React from "react";
import Enquiry_New from "@/components/Home/Enquiry_new";

export const metadata = {
  title: "Bulk Orders & Corporate Enquiries | Astride Furniture",
  description: "Get bulk pricing, dedicated account management, and priority delivery for your entire office workspace from Astride Furniture.",
};

export default function BulkOrdersPage() {
  return (
    <div className="pt-8 md:pt-16 bg-[#131313]">
      <Enquiry_New />
    </div>
  );
}
