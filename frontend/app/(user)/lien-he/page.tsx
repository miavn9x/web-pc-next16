import ContactFeaturePage from "@/features/client/contact/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ | PC Store",
  description: "Liên hệ với chúng tôi để được hỗ trợ tốt nhất.",
};

export default function Page() {
  return <ContactFeaturePage />;
}
