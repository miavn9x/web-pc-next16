// --- [Kiểu dữ liệu biến thể] ---
export interface Variant {
  label: {
    vi: string;
    ja: string;
  };
  price: {
    vi: {
      original: number;
      discountPercent: number;
    };
    ja: {
      original: number;
      discountPercent: number;
    };
  };
}
