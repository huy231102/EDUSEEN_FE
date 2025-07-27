# Hướng dẫn sử dụng tính năng Upload ảnh danh mục lên S3

## Tổng quan
Tính năng upload ảnh danh mục khóa học đã được cập nhật để sử dụng AWS S3 thay vì lưu trữ local. Điều này giúp:
- Tăng tốc độ tải ảnh
- Tiết kiệm dung lượng server
- Đảm bảo tính ổn định và khả năng mở rộng

## Cấu hình cần thiết

### 1. Biến môi trường
Đảm bảo các biến môi trường sau được cấu hình trong file `.env`:

```env
REACT_APP_AWS_S3_BUCKET=your-s3-bucket-name
REACT_APP_AWS_REGION=your-aws-region
REACT_APP_AWS_ACCESS_KEY_ID=your-access-key
REACT_APP_AWS_SECRET_ACCESS_KEY=your-secret-key
```

### 2. Cấu hình S3 Bucket
- Bucket phải được cấu hình để cho phép public read
- CORS policy phải được cấu hình đúng
- IAM user phải có quyền upload lên bucket

## Cách sử dụng

### 1. Thêm danh mục mới
1. Vào trang Admin Dashboard
2. Chọn "Quản lý danh mục khóa học"
3. Click "Thêm danh mục"
4. Nhập tên danh mục
5. Upload ảnh chính và ảnh hover bằng cách:
   - Click "Chọn ảnh"
   - Chọn file ảnh (hỗ trợ: JPG, PNG, GIF, WebP)
   - Click "Upload lên cloud"
   - Đợi quá trình upload hoàn tất
6. Click "Thêm" để lưu

### 2. Chỉnh sửa danh mục
1. Click nút "Sửa" bên cạnh danh mục cần chỉnh sửa
2. Thay đổi thông tin cần thiết
3. Upload ảnh mới nếu cần
4. Click "Lưu" để cập nhật

### 3. Xóa danh mục
1. Click nút "Xóa" bên cạnh danh mục cần xóa
2. Xác nhận việc xóa

## Tính năng mới

### 1. Upload lên S3
- Ảnh được upload trực tiếp lên AWS S3
- Progress bar hiển thị tiến trình upload
- Hỗ trợ preview ảnh trước khi upload

### 2. Validation
- Kiểm tra định dạng file (chỉ cho phép ảnh)
- Giới hạn kích thước file (5MB)
- Validation tên danh mục

### 3. Error Handling
- Thông báo lỗi chi tiết
- Retry mechanism
- Loading states

### 4. UI/UX Improvements
- Giao diện Material-UI đẹp mắt
- Snackbar notifications
- Loading indicators
- Hover effects

## Cấu trúc code

### Frontend
- `ImageS3Upload` component: Xử lý upload lên S3
- `CategoryManager` component: Quản lý danh mục
- `categoryApi.js`: API calls

### Backend
- `CategoryController.cs`: Xử lý CRUD operations
- `CategoryCreateWithUrlDto.cs`: DTO cho URL từ S3
- `Category.cs`: Model

## Troubleshooting

### Lỗi upload
1. Kiểm tra cấu hình AWS credentials
2. Đảm bảo bucket có quyền public read
3. Kiểm tra CORS policy
4. Xem console log để debug

### Lỗi hiển thị ảnh
1. Kiểm tra URL ảnh có đúng không
2. Đảm bảo ảnh đã được upload thành công
3. Kiểm tra network connection

### Lỗi API
1. Kiểm tra backend logs
2. Đảm bảo database connection
3. Kiểm tra API endpoints

## Lưu ý
- Ảnh được lưu trong thư mục `covers/` trên S3
- Tên file được tạo tự động với timestamp
- URL ảnh có dạng: `https://bucket-name.s3.region.amazonaws.com/covers/timestamp_filename`
- Backup ảnh cũ được giữ lại khi update 