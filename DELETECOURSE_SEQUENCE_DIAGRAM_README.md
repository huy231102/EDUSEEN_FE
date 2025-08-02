# Sequence Diagram - Tính năng Xóa khóa học (Delete Course Feature) - Phiên bản đơn giản

## Tổng quan
Sequence diagram này mô tả quy trình xóa khóa học trong hệ thống Eduseen, dành riêng cho Lecturer để xóa các khóa học của mình khỏi hệ thống, bao gồm việc xóa tất cả dữ liệu liên quan như enrollments, reviews, assignments và các tài liệu học tập.

## Các thành phần tham gia (Participants)

### Frontend
- **Lecturer**: Giảng viên xóa khóa học
- **CourseListPage**: Trang danh sách khóa học

### Backend
- **TeacherCourseController**: Bộ điều khiển xử lý khóa học của giảng viên
- **CourseTeacherService**: Service chứa logic nghiệp vụ quản lý khóa học
- **Database**: Cơ sở dữ liệu lưu trữ thông tin

## Luồng xử lý chi tiết

### Bước 1: Chọn và xác nhận
- **1: select course to delete**: Lecturer chọn khóa học cần xóa
- **2: click delete button**: Lecturer click nút xóa
- **3: confirm deletion**: Lecturer xác nhận việc xóa

### Bước 2: Hiển thị dialog xác nhận
- **4: show confirmation dialog**: Hiển thị dialog xác nhận xóa

### Bước 3: Xử lý xác nhận

#### Trường hợp 1: [User confirms] (Người dùng xác nhận)
- **5: deleteCourse request**: Gửi yêu cầu xóa khóa học
- **6: deleteCourseAsync(courseId, teacherId)**: Gọi service xóa khóa học
- **7: verify course ownership**: Kiểm tra quyền sở hữu khóa học

### Bước 4: Xóa dữ liệu liên quan
- **8: delete related data**: Xóa dữ liệu liên quan
- **9: related data deleted**: Xác nhận xóa dữ liệu liên quan

### Bước 5: Xóa khóa học chính
- **10: delete course from database**: Xóa khóa học khỏi database
- **11: course deleted successfully**: Xác nhận xóa khóa học thành công

### Bước 6: Phản hồi và cập nhật
- **12: delete success response**: Trả về phản hồi thành công
- **13: course deleted successfully**: Nhận phản hồi thành công từ backend
- **14: refresh course list**: Làm mới danh sách khóa học
- **15: show success message**: Hiển thị thông báo thành công

#### Trường hợp 2: [User cancels] (Người dùng hủy)
- **5: cancel deletion**: Hủy việc xóa

## So sánh với hệ thống thực tế

### Mapping với hệ thống Eduseen:
- **CourseListPage** ↔ Course list component
- **TeacherCourseController** ↔ `TeacherCourseController.DeleteCourse()`
- **CourseTeacherService** ↔ `CourseTeacherService.DeleteCourseAsync()`
- **Database** ↔ SQL Server database

### Đặc điểm của hệ thống thực tế:
1. **Role-based access**: Chỉ Lecturer mới có quyền xóa
2. **Ownership verification**: Kiểm tra quyền sở hữu khóa học
3. **Cascade deletion**: Xóa tất cả dữ liệu liên quan
4. **Confirmation dialog**: Dialog xác nhận trước khi xóa
5. **Data integrity**: Đảm bảo tính toàn vẹn dữ liệu

## Dữ liệu bị xóa

### Dữ liệu chính:
- **Course**: Khóa học chính
- **Sections**: Các phần học
- **Lectures**: Các bài giảng

### Dữ liệu liên quan:
- **Enrollments**: Đăng ký khóa học
- **Reviews**: Đánh giá khóa học
- **Assignments**: Bài tập
- **Submissions**: Bài nộp
- **UserLectureProgress**: Tiến độ học tập
- **Favorites**: Yêu thích
- **Schedules**: Lịch học
- **ClassCourses**: Lớp học

## Các trường hợp lỗi

### Trường hợp lỗi:
1. **Course không tồn tại**: Hiển thị lỗi 404
2. **Không phải chủ sở hữu**: Hiển thị lỗi 403
3. **Lỗi database**: Hiển thị lỗi server
4. **Lỗi network**: Hiển thị thông báo lỗi
5. **Cascade deletion lỗi**: Hiển thị lỗi xóa dữ liệu liên quan

### Xử lý lỗi:
- **Ownership validation**: Kiểm tra quyền sở hữu khóa học
- **Transaction rollback**: Rollback nếu có lỗi
- **Error handling**: Xử lý lỗi graceful
- **User feedback**: Thông báo lỗi rõ ràng

## Bảo mật và Validation

### Bảo mật:
- **Role-based authorization**: Chỉ Lecturer mới xóa được
- **Ownership verification**: Kiểm tra quyền sở hữu khóa học
- **Confirmation required**: Yêu cầu xác nhận trước khi xóa
- **Data protection**: Bảo vệ dữ liệu nhạy cảm
- **Access control**: Kiểm soát quyền truy cập

### Validation:
- **Lecturer role validation**: Kiểm tra vai trò Lecturer
- **Course ownership validation**: Kiểm tra quyền sở hữu khóa học
- **Confirmation validation**: Kiểm tra xác nhận người dùng
- **Data integrity validation**: Kiểm tra tính toàn vẹn dữ liệu

## Cách sử dụng

### File chính:
- `DeleteCourse_Sequence_Diagram_Simplified.puml` - Sequence diagram xóa khóa học

### Cách render:
1. Mở file `.puml` trong PlantUML editor
2. Hoặc sử dụng online PlantUML renderer
3. Diagram sẽ hiển thị quy trình xóa khóa học

## Lưu ý quan trọng

1. **Lecturer role required**: Chỉ Lecturer mới có quyền xóa
2. **Course ownership**: Chỉ chủ sở hữu mới xóa được
3. **Confirmation dialog**: Yêu cầu xác nhận trước khi xóa
4. **Cascade deletion**: Xóa tất cả dữ liệu liên quan
5. **Data integrity**: Đảm bảo tính toàn vẹn dữ liệu

## Khác biệt với các tính năng khác

### So với Create Course:
- **Destructive action**: Hành động phá hủy thay vì tạo mới
- **Confirmation required**: Yêu cầu xác nhận
- **Cascade deletion**: Xóa dữ liệu liên quan
- **Data cleanup**: Dọn dẹp dữ liệu

### So với Update Course:
- **Permanent action**: Hành động vĩnh viễn thay vì chỉnh sửa
- **Data removal**: Loại bỏ dữ liệu thay vì cập nhật
- **Confirmation dialog**: Dialog xác nhận bắt buộc
- **Cascade effects**: Ảnh hưởng dây chuyền

### So với View Course:
- **Destructive focus**: Tập trung vào phá hủy thay vì xem
- **Action required**: Yêu cầu hành động thay vì chỉ đọc
- **Confirmation process**: Quy trình xác nhận
- **Data removal**: Loại bỏ dữ liệu

## Đặc điểm độc đáo

### Lecturer-specific features:
- **Course ownership**: Quyền sở hữu khóa học
- **Destructive actions**: Hành động phá hủy
- **Data management**: Quản lý dữ liệu
- **System cleanup**: Dọn dẹp hệ thống

### Data management capabilities:
- **Cascade deletion**: Xóa dây chuyền
- **Data integrity**: Tính toàn vẹn dữ liệu
- **Related data cleanup**: Dọn dẹp dữ liệu liên quan
- **System maintenance**: Bảo trì hệ thống

### Security features:
- **Confirmation dialog**: Dialog xác nhận
- **Ownership verification**: Kiểm tra quyền sở hữu
- **Role-based access**: Kiểm soát quyền truy cập
- **Data protection**: Bảo vệ dữ liệu 