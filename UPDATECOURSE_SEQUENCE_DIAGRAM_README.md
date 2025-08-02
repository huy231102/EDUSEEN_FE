# Sequence Diagram - Tính năng Cập nhật khóa học (Update Course Feature) - Phiên bản đơn giản

## Tổng quan
Sequence diagram này mô tả quy trình cập nhật khóa học trong hệ thống Eduseen, dành riêng cho Lecturer để chỉnh sửa và cập nhật thông tin của các khóa học hiện có, bao gồm thông tin cơ bản, curriculum và tài liệu học tập.

## Các thành phần tham gia (Participants)

### Frontend
- **Lecturer**: Giảng viên cập nhật khóa học
- **CourseEditPage**: Trang chỉnh sửa khóa học

### Backend
- **TeacherCourseController**: Bộ điều khiển xử lý khóa học của giảng viên
- **CourseTeacherService**: Service chứa logic nghiệp vụ quản lý khóa học
- **Database**: Cơ sở dữ liệu lưu trữ thông tin

## Luồng xử lý chi tiết

### Bước 1: Truy cập và chỉnh sửa
- **1: navigate to edit course page**: Lecturer truy cập trang chỉnh sửa khóa học
- **2: modify course information**: Lecturer chỉnh sửa thông tin khóa học
- **3: click save button**: Lecturer click nút lưu

### Bước 2: Validation và xử lý
- **4: validate form data**: Kiểm tra dữ liệu form

#### Trường hợp 1: [Form valid] (Form hợp lệ)
- **5: updateCourse request**: Gửi yêu cầu cập nhật khóa học
- **6: updateCourseAsync(courseId, courseData, teacherId)**: Gọi service cập nhật khóa học
- **7: verify course ownership**: Kiểm tra quyền sở hữu khóa học

### Bước 3: Cập nhật database
- **8: save course changes to database**: Lưu thay đổi khóa học vào database
- **9: course updated successfully**: Kết quả cập nhật từ database

### Bước 4: Phản hồi và chuyển hướng
- **10: update success response**: Trả về phản hồi thành công
- **11: course updated successfully**: Nhận phản hồi thành công từ backend
- **12: redirect to teacher dashboard**: Chuyển hướng đến dashboard giảng viên
- **13: show success message**: Hiển thị thông báo thành công

#### Trường hợp 2: [Form invalid] (Form không hợp lệ)
- **5: show validation error**: Hiển thị lỗi validation

## So sánh với hệ thống thực tế

### Mapping với hệ thống Eduseen:
- **CourseEditPage** ↔ `CourseEditPage` component
- **TeacherCourseController** ↔ `TeacherCourseController.UpdateCourse()`
- **CourseTeacherService** ↔ `CourseTeacherService.UpdateCourseAsync()`
- **Database** ↔ SQL Server database

### Đặc điểm của hệ thống thực tế:
1. **Role-based access**: Chỉ Lecturer mới có quyền cập nhật
2. **Ownership verification**: Kiểm tra quyền sở hữu khóa học
3. **Comprehensive update**: Cập nhật toàn bộ thông tin khóa học
4. **Curriculum management**: Quản lý chương trình học
5. **File handling**: Xử lý file upload

## Thông tin có thể cập nhật

### Thông tin cơ bản:
- **Title**: Tiêu đề khóa học
- **Description**: Mô tả khóa học
- **Category**: Danh mục khóa học
- **Level**: Cấp độ (Beginner, Intermediate, Advanced)
- **Cover**: Ảnh bìa khóa học

### Curriculum (Chương trình học):
- **Sections**: Các phần học
  - **Add new sections**: Thêm phần học mới
  - **Update existing sections**: Cập nhật phần học hiện có
  - **Remove sections**: Xóa phần học
  - **Reorder sections**: Sắp xếp lại thứ tự
- **Lectures**: Các bài giảng
  - **Add new lectures**: Thêm bài giảng mới
  - **Update existing lectures**: Cập nhật bài giảng hiện có
  - **Remove lectures**: Xóa bài giảng
  - **Reorder lectures**: Sắp xếp lại thứ tự
  - **Content management**: Quản lý nội dung bài giảng

### Metadata:
- **Updated At**: Thời gian cập nhật
- **Status**: Trạng thái khóa học

## Các trường hợp lỗi

### Trường hợp lỗi:
1. **Form không hợp lệ**: Hiển thị lỗi validation
2. **Course không tồn tại**: Hiển thị lỗi 404
3. **Không phải chủ sở hữu**: Hiển thị lỗi 403
4. **Lỗi database**: Hiển thị lỗi server
5. **Lỗi network**: Hiển thị thông báo lỗi

### Xử lý lỗi:
- **Ownership validation**: Kiểm tra quyền sở hữu khóa học
- **Form validation**: Kiểm tra dữ liệu đầu vào
- **Error handling**: Xử lý lỗi graceful
- **User feedback**: Thông báo lỗi rõ ràng

## Bảo mật và Validation

### Bảo mật:
- **Role-based authorization**: Chỉ Lecturer mới cập nhật được
- **Ownership verification**: Kiểm tra quyền sở hữu khóa học
- **JWT Authentication**: Yêu cầu token hợp lệ
- **Data protection**: Bảo vệ thông tin nhạy cảm
- **Access control**: Kiểm soát quyền truy cập

### Validation:
- **Lecturer role validation**: Kiểm tra vai trò Lecturer
- **Course ownership validation**: Kiểm tra quyền sở hữu khóa học
- **Token validation**: Kiểm tra JWT token
- **Form validation**: Kiểm tra dữ liệu form
- **File validation**: Kiểm tra file upload
- **Data validation**: Kiểm tra dữ liệu hợp lệ

## Cách sử dụng

### File chính:
- `UpdateCourse_Sequence_Diagram_Simplified.puml` - Sequence diagram cập nhật khóa học

### Cách render:
1. Mở file `.puml` trong PlantUML editor
2. Hoặc sử dụng online PlantUML renderer
3. Diagram sẽ hiển thị quy trình cập nhật khóa học

## Lưu ý quan trọng

1. **Lecturer role required**: Chỉ Lecturer mới có quyền cập nhật
2. **Course ownership**: Chỉ chủ sở hữu mới cập nhật được
3. **Comprehensive update**: Cập nhật toàn bộ thông tin khóa học
4. **Curriculum management**: Quản lý chương trình học
5. **File handling**: Xử lý file upload

## Khác biệt với các tính năng khác

### So với Create Course:
- **Edit mode**: Chế độ chỉnh sửa thay vì tạo mới
- **Existing data**: Form đã có dữ liệu sẵn
- **Data update**: Cập nhật dữ liệu thay vì tạo mới
- **Ownership check**: Kiểm tra quyền sở hữu

### So với View Course:
- **Modification focus**: Tập trung vào chỉnh sửa thay vì xem
- **Form interaction**: Tương tác với form chỉnh sửa
- **Data update**: Cập nhật dữ liệu thay vì chỉ đọc
- **Backend update**: Cập nhật database

### So với Login:
- **Content modification**: Chỉnh sửa nội dung thay vì xác thực
- **Lecturer specific**: Dành riêng cho Lecturer
- **Complex form**: Form phức tạp với nhiều trường
- **File handling**: Xử lý file upload

## Đặc điểm độc đáo

### Lecturer-specific features:
- **Course ownership**: Quyền sở hữu khóa học
- **Content modification**: Chỉnh sửa nội dung
- **Curriculum management**: Quản lý chương trình học
- **Educational tools**: Công cụ giáo dục

### Content management capabilities:
- **Course information**: Thông tin khóa học
- **Section management**: Quản lý phần học
- **Lecture management**: Quản lý bài giảng
- **File upload**: Tải lên tài liệu
- **Media handling**: Xử lý media

### Educational features:
- **Structured learning**: Học tập có cấu trúc
- **Progressive content**: Nội dung tiến bộ
- **Multimedia support**: Hỗ trợ đa phương tiện
- **Assessment ready**: Sẵn sàng đánh giá
- **Content evolution**: Phát triển nội dung 