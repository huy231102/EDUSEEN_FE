# Sequence Diagram - Tính năng Tạo khóa học (Create Course Feature) - Phiên bản đơn giản

## Tổng quan
Sequence diagram này mô tả quy trình tạo khóa học trong hệ thống Eduseen, dành riêng cho Lecturer để tạo và định nghĩa các khóa học mới với thông tin chi tiết, curriculum và tài liệu học tập.

## Các thành phần tham gia (Participants)

### Frontend
- **Lecturer**: Giảng viên tạo khóa học
- **CourseEditPage**: Trang chỉnh sửa/tạo khóa học

### Backend
- **AuthContext**: Context React quản lý trạng thái xác thực
- **TeacherCourseController**: Bộ điều khiển xử lý khóa học của giảng viên
- **CourseTeacherService**: Service chứa logic nghiệp vụ quản lý khóa học
- **Database**: Cơ sở dữ liệu lưu trữ thông tin

## Luồng xử lý chi tiết

### Bước 1: Truy cập và xác thực
- **1: navigate to create course page**: Lecturer truy cập trang tạo khóa học
- **2: check lecturer authentication**: Kiểm tra trạng thái đăng nhập
- **3: verify lecturer role**: Xác thực vai trò Lecturer
- **4: lecturer user data**: Trả về thông tin lecturer từ context

### Bước 2: Xử lý điều kiện

#### Trường hợp 1: [Lecturer authenticated] (Lecturer đã xác thực)
- **5: load course creation form**: Tải form tạo khóa học
- **6: fill course information**: Lecturer điền thông tin khóa học
- **7: add sections and lectures**: Lecturer thêm sections và lectures
- **8: upload course cover image**: Lecturer tải ảnh bìa khóa học
- **9: click save button**: Lecturer click nút lưu
- **10: validate form data**: Kiểm tra dữ liệu form

### Bước 3: Xử lý backend

#### Trường hợp 1: [Form valid] (Form hợp lệ)
- **11: createCourse request**: Gửi yêu cầu tạo khóa học
- **12: verify lecturer authorization**: Kiểm tra quyền Lecturer
- **13: createCourseAsync(courseData, teacherId)**: Gọi service tạo khóa học
- **14: build course entity**: Xây dựng entity khóa học từ DTO

### Bước 4: Lưu trữ dữ liệu
- **15: save course to database**: Lưu khóa học vào database
- **16: course created successfully**: Xác nhận tạo khóa học thành công
- **17: map to CourseDTO**: Chuyển đổi sang CourseDTO

### Bước 5: Phản hồi và chuyển hướng
- **18: course creation response**: Trả về phản hồi tạo khóa học
- **19: course created successfully**: Nhận phản hồi thành công từ backend
- **20: redirect to teacher dashboard**: Chuyển hướng đến dashboard giảng viên
- **21: show success message**: Hiển thị thông báo thành công

#### Trường hợp 2: [Form invalid] (Form không hợp lệ)
- **11: show validation error**: Hiển thị lỗi validation

#### Trường hợp 3: [Not lecturer] (Không phải Lecturer)
- Chuyển hướng đến trang không được phép truy cập

## So sánh với hệ thống thực tế

### Mapping với hệ thống Eduseen:
- **CourseEditPage** ↔ `CourseEditPage` component
- **AuthContext** ↔ `AuthContext` (React Context)
- **TeacherCourseController** ↔ `TeacherCourseController.CreateCourse()`
- **CourseTeacherService** ↔ `CourseTeacherService.CreateCourseAsync()`
- **Database** ↔ SQL Server database

### Đặc điểm của hệ thống thực tế:
1. **Role-based access**: Chỉ Lecturer mới có quyền tạo khóa học
2. **Comprehensive form**: Form đầy đủ thông tin khóa học
3. **Curriculum builder**: Xây dựng chương trình học
4. **File upload**: Tải lên ảnh bìa và tài liệu
5. **Real-time validation**: Kiểm tra dữ liệu real-time

## Thông tin khóa học

### Thông tin cơ bản:
- **Title**: Tiêu đề khóa học
- **Description**: Mô tả khóa học
- **Category**: Danh mục khóa học
- **Level**: Cấp độ (Beginner, Intermediate, Advanced)
- **Cover**: Ảnh bìa khóa học

### Curriculum (Chương trình học):
- **Sections**: Các phần học
  - **Section Title**: Tiêu đề phần học
  - **Section Order**: Thứ tự phần học
- **Lectures**: Các bài giảng
  - **Lecture Title**: Tiêu đề bài giảng
  - **Content Type**: Loại nội dung (video, document, etc.)
  - **Content URL**: Đường dẫn nội dung
  - **Duration**: Thời lượng bài giảng
  - **Order**: Thứ tự bài giảng

### Metadata:
- **Teacher ID**: ID của giảng viên
- **Created At**: Thời gian tạo
- **Updated At**: Thời gian cập nhật
- **Status**: Trạng thái khóa học

## Các trường hợp lỗi

### Trường hợp lỗi:
1. **Không phải Lecturer**: Chuyển hướng đến trang unauthorized
2. **Token không hợp lệ**: Chuyển hướng đến login
3. **Form không hợp lệ**: Hiển thị lỗi validation
4. **Category không tồn tại**: Hiển thị lỗi 400
5. **Lỗi database**: Hiển thị lỗi server
6. **Lỗi network**: Hiển thị thông báo lỗi
7. **File upload lỗi**: Hiển thị lỗi upload

### Xử lý lỗi:
- **Role validation**: Kiểm tra vai trò Lecturer
- **Form validation**: Kiểm tra dữ liệu đầu vào
- **File validation**: Kiểm tra file upload
- **Error handling**: Xử lý lỗi graceful
- **User feedback**: Thông báo lỗi rõ ràng

## Bảo mật và Validation

### Bảo mật:
- **Role-based authorization**: Chỉ Lecturer mới tạo được
- **JWT Authentication**: Yêu cầu token hợp lệ
- **Data protection**: Bảo vệ thông tin nhạy cảm
- **Access control**: Kiểm soát quyền truy cập

### Validation:
- **Lecturer role validation**: Kiểm tra vai trò Lecturer
- **Token validation**: Kiểm tra JWT token
- **Form validation**: Kiểm tra dữ liệu form
- **File validation**: Kiểm tra file upload
- **Data validation**: Kiểm tra dữ liệu hợp lệ

## Cách sử dụng

### File chính:
- `CreateCourse_Sequence_Diagram_Simplified.puml` - Sequence diagram tạo khóa học

### Cách render:
1. Mở file `.puml` trong PlantUML editor
2. Hoặc sử dụng online PlantUML renderer
3. Diagram sẽ hiển thị quy trình tạo khóa học

## Lưu ý quan trọng

1. **Lecturer role required**: Chỉ Lecturer mới có quyền tạo
2. **Comprehensive form**: Form đầy đủ thông tin khóa học
3. **Curriculum builder**: Xây dựng chương trình học
4. **File upload**: Tải lên ảnh bìa và tài liệu
5. **Real-time validation**: Kiểm tra dữ liệu real-time

## Khác biệt với các tính năng khác

### So với Update Course:
- **Create mode**: Chế độ tạo mới thay vì chỉnh sửa
- **Empty form**: Form trống để điền thông tin
- **New entity**: Tạo entity mới thay vì cập nhật
- **Initial setup**: Thiết lập ban đầu

### So với View Course:
- **Creation focus**: Tập trung vào tạo mới
- **Form interaction**: Tương tác với form
- **Data creation**: Tạo dữ liệu thay vì chỉ đọc
- **File upload**: Tải lên file

### So với Login:
- **Content creation**: Tạo nội dung thay vì xác thực
- **Lecturer specific**: Dành riêng cho Lecturer
- **Complex form**: Form phức tạp với nhiều trường
- **File handling**: Xử lý file upload

## Đặc điểm độc đáo

### Lecturer-specific features:
- **Course creation**: Tạo khóa học mới
- **Curriculum design**: Thiết kế chương trình học
- **Content management**: Quản lý nội dung
- **Educational tools**: Công cụ giáo dục

### Content creation capabilities:
- **Course information**: Thông tin khóa học
- **Section management**: Quản lý phần học
- **Lecture creation**: Tạo bài giảng
- **File upload**: Tải lên tài liệu
- **Media handling**: Xử lý media

### Educational features:
- **Structured learning**: Học tập có cấu trúc
- **Progressive content**: Nội dung tiến bộ
- **Multimedia support**: Hỗ trợ đa phương tiện
- **Assessment ready**: Sẵn sàng đánh giá 