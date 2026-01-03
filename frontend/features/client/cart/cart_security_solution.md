# Giải Pháp Bảo Mật Giỏ Hàng (Cart Security Solution)

Tài liệu này mô tả giải pháp thiết kế và triển khai giỏ hàng đảm bảo tính bảo mật về giá cả và dữ liệu, khắc phục nhược điểm của việc lưu trữ thông tin sản phẩm trực tiếp tại Client (LocalStorage/SessionStorage).

## Vấn đề hiện tại

Hiện tại, Frontend đang lưu toàn bộ đối tượng sản phẩm (bao gồm `id`, `name`, `price`, `image`) vào `localStorage`.

- **Nguy cơ:** Người dùng có kiến thức kỹ thuật có thể mở DevTools (F12), sửa đổi giá trị `price` trong `localStorage`. Nếu Backend không kiểm tra lại giá gốc, đơn hàng sẽ được tạo với giá sai lệch.

## Giải Pháp Đề Xuất: Mô hình "Store ID, Verify Price"

### 1. Nguyên lý cốt lõi

- **Frontend (Client side):** Chỉ là nơi lưu trữ "Nguyện vọng mua hàng" của người dùng (muốn mua cái gì, số lượng bao nhiêu). Frontend **KHÔNG** có quyền quyết định giá bán.
- **Backend (Server side):** Là nơi duy nhất nắm giữ "Chân lý" (Single Source of Truth) về giá cả và thông tin sản phẩm.

### 2. Luồng dữ liệu chi tiết

#### A. Lưu trữ tại Frontend (LocalStorage)

Thay vì lưu cả object sản phẩm, Frontend chỉ lưu mảng các items đơn giản gồm `productId` và `quantity`.

**Dữ liệu Front-end lưu:**

```json
[
  { "productId": "SP001", "quantity": 2 },
  { "productId": "SP002", "quantity": 1 }
]
```

#### B. Hiển thị Giỏ Hàng (View Cart)

Khi người dùng vào trang Giỏ hàng:

1.  Frontend đọc danh sách `productId` từ Storage.
2.  Frontend gọi API tới Backend: `POST /api/products/get-cart-details` với body là danh sách ID.
3.  Backend trả về thông tin chi tiết (Tên, Ảnh, Giá mới nhất) của các ID đó.
4.  Frontend hiển thị giao diện dựa trên dữ liệu Backend trả về.

#### C. Quy trình Thanh Toán (Checkout) - QUAN TRỌNG

Khi người dùng bấm "Đặt hàng":

1.  Frontend chỉ gửi danh sách items lên API Order:
    ```json
    {
      "items": [
        { "productId": "SP001", "quantity": 2 },
        { "productId": "SP002", "quantity": 1 }
      ],
      "customerInfo": { ... }
    }
    ```
2.  **Backend xử lý:**
    - Nhận `productId`.
    - Truy vấn Database để lấy giá bán hiện tại (`current_price`) của sản phẩm đó.
    - Tính tổng tiền: `Total = current_price * quantity`.
    - Tạo đơn hàng với tổng tiền do Server tính toán.

### 3. Ưu điểm

- **Bảo mật tuyệt đối:** Hacker có sửa `localStorage` thành giá 1đ thì khi gửi lên Server, Server vẫn lấy giá gốc 10tr trong Database để tính tiền.
- **Tính toàn vẹn dữ liệu:** Nếu Admin đổi tên hoặc đổi giá sản phẩm trên hệ thống, giỏ hàng của khách (khi reload) sẽ tự động cập nhật theo thông tin mới nhất.

### 4. Triển khai (Roadmap)

Để áp dụng giải pháp này, cần đợi triển khai **API Backend** với các endpoints:

- `POST /api/cart/validate`: Nhận list ID -> Trả về List Product Details.
- `POST /api/orders`: Nhận list ID + Qty -> Tự tính tiền server-side.

---

_Created by Antigravity_
