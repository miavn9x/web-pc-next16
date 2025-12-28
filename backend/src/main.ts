// --- Import Thư Viện và Module Chính ---
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
// --- Import Cấu Hình Ứng Dụng ---
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { MulterExceptionFilter } from './common/filters/multer-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { validateEnv } from './configs/check-env.config';
import { connectToDatabase } from './configs/database.config';

// --- Hàm Khởi Động Ứng Dụng ---
async function bootstrap() {
  // Ghi log bắt đầu quá trình khởi tạo
  console.log('Đang khởi tạo ứng dụng...');

  // Gọi hàm kiểm tra biến môi trường bắt buộc
  validateEnv();

  // --- Kết Nối Cơ Sở Dữ Liệu ---
  await connectToDatabase();

  // Khởi tạo NestJS app với module gốc
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // --- Security Headers với Helmet ---
  // Backend chỉ serve JSON API → Không cần CSP phức tạp
  // CSP chỉ quan trọng cho frontend serve HTML
  app.use(
    helmet({
      // Tắt CSP vì backend API không serve HTML
      contentSecurityPolicy: false,
      // Cho phép load tài nguyên (ảnh) từ domain khác (frontend)
      crossOriginResourcePolicy: false,

      // Giữ các headers bảo mật quan trọng khác:
      // - X-Frame-Options: SAMEORIGIN (chống clickjacking)
      // - X-Content-Type-Options: nosniff (chống MIME sniffing)
      // - Strict-Transport-Security (bắt buộc HTTPS)
      // - X-XSS-Protection: 1; mode=block
    }),
  );

  // Đăng ký middleware cookie-parser để có thể đọc refreshToken từ HttpOnly Cookie
  app.use(cookieParser());

  // Cấu hình Trust Proxy để lấy đúng IP khi chạy sau Nginx/Load Balancer
  app.set('trust proxy', true);

  // Bật CORS để cho phép frontend từ origin được chỉ định truy cập tài nguyên của backend
  app.enableCors({
    origin: (requestOrigin, callback) => {
      const allowedOrigins = [
        'http://localhost:3030',
        'http://localhost:3000',
        'http://demobanhtrang.wfourtech.vn',
        'https://demobanhtrang.wfourtech.vn',
        // [PRODUCTION] Bỏ comment khi lên VPS
        // 'https://miavn9x.id.vn',
        // 'https://www.miavn9x.id.vn',
      ];

      // Cho phép request không có origin (như server-to-server, postman, mobile app)
      if (!requestOrigin) return callback(null, true);

      // Cho phép nếu nằm trong whitelist (Domain thật)
      if (allowedOrigins.includes(requestOrigin)) return callback(null, true);

      // Nếu KHÔNG PHẢI production, cho phép MỌI REQUEST để tiện testing (LAN, Tunnel, IP lạ...)
      // QUAN TRỌNG: Khi dùng credentials, PHẢI trả về origin cụ thể (không được dùng '*')
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, requestOrigin); // ✅ Trả về chính xác origin của request
      }

      // Production: Từ chối origin không nằm trong whitelist
      return callback(new Error('CORS không cho phép origin này'));
    },
    credentials: true,
  });

  // Thiết lập tiền tố "/api" cho toàn bộ route, giúp tổ chức endpoint rõ ràng hơn
  app.setGlobalPrefix('api');

  // Đăng ký interceptor toàn cục để chuẩn hóa response
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Đăng ký filter toàn cục để chuẩn hóa lỗi
  app.useGlobalFilters(new HttpExceptionFilter());

  // Đăng ký filter cho lỗi Multer
  app.useGlobalFilters(new MulterExceptionFilter());

  // Đọc biến môi trường PORT
  const port = process.env.PORT;

  // Nếu không có PORT, log lỗi và thoát
  if (!port) {
    console.error(
      `[NEST] [${new Date().toLocaleString()}] ❌ Thiếu biến môi trường PORT. Vui lòng cấu hình trước khi khởi động ứng dụng.`,
    );
    process.exit(1);
  } else {
    console.log(
      `[NEST] [${new Date().toLocaleString()}] ✅ Biến môi trường PORT đã được cấu hình: ${port}`,
    );
  }

  // Lắng nghe cổng đã cấu hình
  await app.listen(4000, '0.0.0.0');

  // Ghi log khi ứng dụng đã sẵn sàng
  console.log(
    `[NEST] [${new Date().toLocaleString()}] 🚀 Ứng dụng Web Bánh Tráng đã khởi động thành công tại: http://localhost:${port}`,
  );
}
// --- Gọi Hàm Khởi Động Ứng Dụng ---
void bootstrap();
