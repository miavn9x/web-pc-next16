import { Suspense } from "react";
import ProductListing from "@/features/client/product/ProductListing/ProductListing";

export default function ProductPage() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Đang tải sản phẩm...</div>}
    >
      <ProductListing />
    </Suspense>
  );
}
