# Sequence Diagram - Tính năng Xem danh sách khóa học (View Course List Feature) - Phiên bản đơn giản

## Tổng quan
Sequence diagram này mô tả quy trình xem danh sách khóa học trong hệ thống Eduseen, dành riêng cho Lecturer để xem tất cả các khóa học của mình với thông tin tổng quan, thống kê và các tùy chọn quản lý.

## Các thành phần tham gia (Participants)

### Frontend
- **Lecturer**: Giảng viên xem danh sách khóa học
- **TeacherDashboardPage**: Trang dashboard của giảng viên

### Backend
- **AuthContext**: Context React quản lý trạng thái xác thực
- **TeacherCourseController**: Bộ điều khiển xử lý khóa học của giảng viên
- **CourseTeacherService**: Service chứa logic nghiệp vụ quản lý khóa học
- **Database**: Cơ sở dữ liệu lưu trữ thông tin

## Luồng xử lý chi tiết

### Bước 1: Truy cập và xác thực
- **1: navigate to teacher dashboard**: Lecturer truy cập trang dashboard giảng viên
- **2: check lecturer authentication**: Kiểm tra trạng thái đăng nhập
- **3: verify lecturer role**: Xác thực vai trò Lecturer
- **4: lecturer user data**: Trả về thông tin lecturer từ context

### Bước 2: Xử lý điều kiện

#### Trường hợp 1: [Lecturer authenticated] (Lecturer đã xác thực)
- **5: load teacher dashboard**: Tải trang dashboard giảng viên
- **6: getCourses request**: Gửi yêu cầu lấy danh sách khóa học
- **7: verify lecturer authorization**: Kiểm tra quyền Lecturer

### Bước 3: Xử lý backend
- **8: getCoursesAsync(teacherId)**: Gọi service lấy danh sách khóa học
- **9: query courses by teacher ID**: Truy vấn khóa học theo ID giảng viên
- **10: courses data**: Trả về dữ liệu khóa học từ database

### Bước 4: Xử lý dữ liệu
- **11: transform to CourseDTO**: Chuyển đổi sang định dạng CourseDTO
- **12: courses list response**: Trả về danh sách khóa học
- **13: courses data for display**: Nhận dữ liệu khóa học để hiển thị

### Bước 5: Hiển thị
- **14: process and display courses**: Xử lý và hiển thị khóa học
- **15: render course list**: Render danh sách khóa học

#### Trường hợp 2: [Not lecturer] (Không phải Lecturer)
- Chuyển hướng đến trang không được phép truy cập

## So sánh với hệ thống thực tế

### Mapping với hệ thống Eduseen:
- **TeacherDashboardPage** ↔ `TeacherDashboardPage` component
- **AuthContext** ↔ `AuthContext` (React Context)
- **TeacherCourseController** ↔ `TeacherCourseController.GetCourses()`
- **CourseTeacherService** ↔ `CourseTeacherService.GetCoursesAsync()`
- **Database** ↔ SQL Server database

### Đặc điểm của hệ thống thực tế:
1. **Role-based access**: Chỉ Lecturer mới có quyền xem
2. **Ownership filtering**: Chỉ hiển thị khóa học của giảng viên
3. **Comprehensive data**: Bao gồm thông tin chi tiết khóa học
4. **Dashboard interface**: Giao diện dashboard quản lý
5. **Real-time data**: Dữ liệu được cập nhật real-time

## Thông tin hiển thị

### Thông tin cơ bản:
- **Course ID**: Mã khóa học
- **Title**: Tiêu đề khóa học
- **Cover**: Ảnh bìa khóa học
- **Description**: Mô tả khóa học

### Thống kê khóa học:
- **Total Lectures**: Tổng số bài giảng
- **Total Time**: Tổng thời lượng (giờ)
- **Enrolled Count**: Số học viên đăng ký
- **Average Rating**: Đánh giá trung bình

### Thông tin chi tiết:
- **Sections**: Số phần học
- **Assignments**: Số bài tập
- **Created At**: Ngày tạo
- **Updated At**: Ngày cập nhật

### Tùy chọn quản lý:
- **Edit Course**: Chỉnh sửa khóa học
- **Manage Reviews**: Quản lý đánh giá
- **View Analytics**: Xem thống kê
- **Manage Assignments**: Quản lý bài tập
- **Delete Course**: Xóa khóa học

## Các trường hợp lỗi

### Trường hợp lỗi:
1. **Không phải Lecturer**: Chuyển hướng đến trang unauthorized
2. **Token không hợp lệ**: Chuyển hướng đến login
3. **Lỗi database**: Hiển thị lỗi server
4. **Lỗi network**: Hiển thị thông báo lỗi
5. **Không có khóa học**: Hiển thị thông báo "Không có khóa học"

### Xử lý lỗi:
- **Role validation**: Kiểm tra vai trò Lecturer
- **Error handling**: Xử lý lỗi graceful
- **User feedback**: Thông báo lỗi rõ ràng
- **Fallback display**: Hiển thị thông báo thay thế

## Bảo mật và Validation

### Bảo mật:
- **Role-based authorization**: Chỉ Lecturer mới xem được
- **JWT Authentication**: Yêu cầu token hợp lệ
- **Data protection**: Bảo vệ thông tin nhạy cảm
- **Access control**: Kiểm soát quyền truy cập

### Validation:
- **Lecturer role validation**: Kiểm tra vai trò Lecturer
- **Token validation**: Kiểm tra JWT token
- **Data validation**: Kiểm tra dữ liệu hợp lệ
- **Ownership validation**: Kiểm tra quyền sở hữu

## Cách sử dụng

### File chính:
- `ViewCourseList_Sequence_Diagram_Simplified.puml` - Sequence diagram xem danh sách khóa học

### Cách render:
1. Mở file `.puml` trong PlantUML editor
2. Hoặc sử dụng online PlantUML renderer
3. Diagram sẽ hiển thị quy trình xem danh sách khóa học

## Lưu ý quan trọng

1. **Lecturer role required**: Chỉ Lecturer mới có quyền xem
2. **Ownership filtering**: Chỉ hiển thị khóa học của giảng viên
3. **Dashboard interface**: Giao diện dashboard quản lý
4. **Comprehensive data**: Thông tin chi tiết khóa học
5. **Management options**: Các tùy chọn quản lý

## Khác biệt với các tính năng khác

### So với Create Course:
- **Read-only**: Chỉ đọc dữ liệu thay vì tạo mới
- **List view**: Hiển thị danh sách thay vì form
- **Overview focus**: Tập trung vào tổng quan
- **Management interface**: Giao diện quản lý

### So với Update Course:
- **List display**: Hiển thị danh sách thay vì chỉnh sửa
- **Multiple courses**: Nhiều khóa học thay vì một
- **Overview information**: Thông tin tổng quan
- **Navigation hub**: Trung tâm điều hướng

### So với Delete Course:
- **Read operation**: Thao tác đọc thay vì xóa
- **List view**: Hiển thị danh sách
- **No destructive action**: Không có hành động phá hủy
- **Management overview**: Tổng quan quản lý

## Đặc điểm độc đáo

### Lecturer-specific features:
- **Course ownership**: Quyền sở hữu khóa học
- **Dashboard view**: Góc nhìn dashboard
- **Course management**: Quản lý khóa học
- **Overview interface**: Giao diện tổng quan

### Dashboard capabilities:
- **Course overview**: Tổng quan khóa học
- **Quick actions**: Hành động nhanh
- **Statistics display**: Hiển thị thống kê
- **Navigation hub**: Trung tâm điều hướng

### Management features:
- **Course listing**: Danh sách khóa học
- **Quick access**: Truy cập nhanh
- **Status overview**: Tổng quan trạng thái
- **Action buttons**: Nút hành động 