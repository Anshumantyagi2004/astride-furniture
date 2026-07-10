import { Metadata } from "next";
export const metadata: Metadata = {
  title: "ASTRIDE® Blog | Office Furniture, Ergonomic Chairs & Workspace Tips",
  description: "Explore the ASTRIDE® Blog for expert insights on ergonomic office chairs, gaming chairs, office furniture, workspace design, productivity tips, buying guides, and the latest trends to create comfortable and efficient work environments.",
};
export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}