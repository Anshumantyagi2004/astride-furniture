import React from 'react';
import Enquiry_New from "@/components/Home/Enquiry_new";

export const metadata = {
  title: "Corporate Bulk Enquiry | ASTRIDE® Office Furniture",
  description: "Submit corporate bulk order enquiries for ergonomic office chairs, gaming chairs, and custom workspace seating across India.",
};

export default function BulkEnquiryPage() {
  return (
    <main className="min-h-screen bg-[#131313] pt-10 pb-16">
      <Enquiry_New />
    </main>
  );
}
