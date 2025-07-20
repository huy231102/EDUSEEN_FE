# Hướng dẫn tích hợp API - Quản lý khóa học

## Tổng quan
Màn hình Quản lý khóa học đã được tích hợp với các API từ Backend (BE) để thực hiện các chức năng CRUD đầy đủ.

## API Endpoints được sử dụng

### 1. Lấy danh sách khóa học
- **Endpoint**: `GET /api/courses`
- **Controller**: `CourseController.cs`
- **Chức năng**: Lấy tất cả khóa học từ hệ thống
- **Response**: Array của CourseDto

### 2. Tạo khóa học mới
- **Endpoint**: `POST /api/teacher/course`
- **Controller**: `TeacherCourseController.cs`
- **Chức năng**: Tạo khóa học mới (dành cho giáo viên)
- **Request Body**: CreateCourseDTO
- **Response**: CourseDto

### 3. Cập nhật khóa học
- **Endpoint**: `PUT /api/teacher/course/{courseId}`
- **Controller**: `TeacherCourseController.cs`
- **Chức năng**: Cập nhật thông tin khóa học
- **Request Body**: UpdateCourseDTO
- **Response**: 204 No Content

### 4. Xóa khóa học
- **Endpoint**: `DELETE /api/teacher/course/{courseId}`
- **Controller**: `TeacherCourseController.cs`
- **Chức năng**: Xóa khóa học
- **Response**: 204 No Content

### 5. Lấy chi tiết khóa học
- **Endpoint**: `GET /api/courses/detail/{courseId}`
- **Controller**: `CourseController.cs`
- **Chức năng**: Lấy thông tin chi tiết khóa học
- **Response**: CourseDetailDto

## Cấu trúc dữ liệu

### CourseDto (từ BE)
```json
{
  "courseId": 1,
  "title": "Tên khóa học",
  "description": "Mô tả khóa học",
  "teacherName": "Tên giáo viên",
  "categoryName": "Tên danh mục",
  "level": "Beginner|Intermediate|Advanced",
  "price": 0,
  "thumbnailUrl": "URL ảnh đại diện",
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00",
  "enrollmentCount": 10
}
```

### CreateCourseDTO (gửi lên BE)
```json
{
  "title": "Tên khóa học",
  "description": "Mô tả khóa học",
  "categoryId": 1,
  "level": "Beginner",
  "price": 0,
  "thumbnailUrl": "URL ảnh đại diện"
}
```

## Chức năng đã tích hợp

### 1. Hiển thị danh sách khóa học
- ✅ Lấy dữ liệu từ API `/api/courses`
- ✅ Hiển thị với phân trang
- ✅ Tìm kiếm theo tên khóa học, giáo viên
- ✅ Lọc theo trạng thái, ngày tạo
- ✅ Loading state với animation

### 2. Thêm khóa học mới
- ✅ Form nhập liệu đầy đủ
- ✅ Gọi API `POST /api/teacher/course`
- ✅ Validation dữ liệu
- ✅ Toast notification thành công/lỗi

### 3. Sửa khóa học
- ✅ Form chỉnh sửa với dữ liệu hiện tại
- ✅ Gọi API `PUT /api/teacher/course/{id}`
- ✅ Cập nhật real-time

### 4. Xóa khóa học
- ✅ Confirm dialog trước khi xóa
- ✅ Gọi API `DELETE /api/teacher/course/{id}`
- ✅ Refresh danh sách sau khi xóa

### 5. Duyệt/Khóa khóa học
- ✅ Toggle trạng thái khóa học
- ✅ Gọi API cập nhật trạng thái
- ✅ Icon thay đổi theo trạng thái

### 6. Xem chi tiết khóa học
- ✅ Dialog hiển thị thông tin đầy đủ
- ✅ Layout responsive
- ✅ Nút chuyển sang sửa khóa học

## Cải tiến giao diện

### 1. Bảng khóa học
- ✅ Header với icon và nút thêm mới
- ✅ Cột hiển thị ảnh đại diện
- ✅ Chip cho mã khóa học, cấp độ, trạng thái
- ✅ Tooltip cho các nút thao tác
- ✅ Hover effect cho từng dòng

### 2. Form thêm/sửa
- ✅ Validation đầy đủ
- ✅ Select cho danh mục và cấp độ
- ✅ Input số cho giá
- ✅ Preview ảnh đại diện

### 3. Dialog chi tiết
- ✅ Layout 2 cột responsive
- ✅ Hiển thị ảnh đại diện
- ✅ Chip cho các trạng thái
- ✅ Nút chuyển sang sửa

## Xử lý lỗi

### 1. Network Error
- ✅ Try-catch cho tất cả API calls
- ✅ Toast notification cho lỗi
- ✅ Fallback data khi cần

### 2. Validation Error
- ✅ Kiểm tra dữ liệu trước khi gửi
- ✅ Hiển thị lỗi validation
- ✅ Disable nút submit khi dữ liệu không hợp lệ

### 3. Loading State
- ✅ Spinner animation khi tải dữ liệu
- ✅ Disable các nút khi đang xử lý
- ✅ Skeleton loading (có thể thêm sau)

## Cấu hình

### 1. Base URL
- Được cấu hình trong `src/services/api.js`
- Mặc định: `https://localhost:7256`
- Có thể thay đổi qua environment variable `REACT_APP_API_URL`

### 2. Authentication
- Tự động gửi Bearer token từ localStorage
- Token được parse từ JSON string
- Fallback cho trường hợp parse lỗi

## Hướng dẫn sử dụng

### 1. Chạy ứng dụng
```bash
npm start
```

### 2. Đảm bảo BE đang chạy
- Backend phải chạy trên port 7256
- Hoặc cấu hình đúng URL trong environment

### 3. Test các chức năng
- Thêm khóa học mới
- Sửa thông tin khóa học
- Xóa khóa học
- Duyệt/khóa khóa học
- Xem chi tiết khóa học

## Lưu ý

1. **Quyền truy cập**: Các API teacher yêu cầu quyền giáo viên
2. **Validation**: BE sẽ validate dữ liệu trước khi lưu
3. **Error handling**: Tất cả lỗi được hiển thị qua toast
4. **Real-time**: Danh sách tự động refresh sau mỗi thao tác
5. **Responsive**: Giao diện tương thích mobile và desktop

## Cải tiến tương lai

1. **Upload ảnh**: Tích hợp upload ảnh đại diện
2. **Bulk actions**: Chọn nhiều khóa học để thao tác
3. **Export data**: Xuất danh sách khóa học
4. **Advanced filters**: Thêm bộ lọc nâng cao
5. **Real-time updates**: WebSocket cho cập nhật real-time 