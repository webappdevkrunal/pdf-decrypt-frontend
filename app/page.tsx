import { PDFFiller } from "@/components/pdf-filler/pdf-filler";

export const metadata = {
  title: "PDF Form Filler",
  description: "Upload a PDF and automatically fill it with sample data",
};

export default function Home() {
  return <PDFFiller />;
}
