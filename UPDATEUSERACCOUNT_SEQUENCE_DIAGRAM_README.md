# Sequence Diagram - Tính năng Cập nhật tài khoản người dùng (Update User Account Feature) - Phiên bản đơn giản

## Tổng quan
Sequence diagram này mô tả quy trình cập nhật tài khoản người dùng trong hệ thống Eduseen, dành riêng cho Administrator để thay đổi vai trò và các thông tin quản trị khác của người dùng trong hệ thống.

## Các thành phần tham gia (Participants)

### Frontend
- **Admin**: Administrator truy cập hệ thống
- **AdminDashboard**: Giao diện quản trị viên

### Backend
- **UserController**: Bộ điều khiển xử lý thông tin người dùng
- **UserService**: Service chứa logic nghiệp vụ quản lý người dùng
- **Database**: Cơ sở dữ liệu lưu trữ thông tin

## Luồng xử lý chi tiết

### Bước 1: Chọn và chỉnh sửa
- **1: select user and click edit**: Admin chọn người dùng và click nút chỉnh sửa
- **2: modify user information**: Admin thay đổi thông tin người dùng
- **3: click save button**: Admin click nút lưu

### Bước 2: Validation và xử lý
- **4: validate form data**: Kiểm tra dữ liệu form

#### Trường hợp 1: [Form valid] (Form hợp lệ)
- **5: updateUser request**: Gửi yêu cầu cập nhật người dùng
- **6: updateUserAsync(userId, userData)**: Gọi service cập nhật người dùng
- **7: validate permissions**: Kiểm tra quyền Admin và không cập nhật tài khoản của chính mình

### Bước 3: Cập nhật database
- **8: update user record**: Cập nhật bản ghi người dùng trong database
- **9: update result**: Kết quả cập nhật từ database

### Bước 4: Phản hồi và hiển thị
- **10: update success response**: Trả về phản hồi thành công
- **11: update success**: Nhận phản hồi thành công từ backend
- **12: update local user list**: Cập nhật danh sách người dùng local
- **13: show success message**: Hiển thị thông báo thành công

#### Trường hợp 2: [Form invalid] (Form không hợp lệ)
- **5: show validation error**: Hiển thị lỗi validation

## So sánh với hệ thống thực tế

### Mapping với hệ thống Eduseen:
- **AdminDashboard** ↔ `AdminDashboard` component
- **UserController** ↔ `UserController.UpdateUserAsync()`
- **UserService** ↔ `UserService.UpdateUserAsync()`
- **Database** ↔ SQL Server database

### Đặc điểm của hệ thống thực tế:
1. **Role-based access**: Chỉ Admin mới có quyền cập nhật
2. **Self-protection**: Admin không thể cập nhật tài khoản của chính mình
3. **Role management**: Tập trung vào thay đổi vai trò người dùng
4. **Modal interface**: Chỉnh sửa trong modal popup
5. **Real-time update**: Cập nhật danh sách ngay lập tức

## Thông tin có thể cập nhật

### Thông tin vai trò:
- **Role ID**: Mã vai trò (1: Student, 2: Admin, 3: Teacher)
- **Role Name**: Tên vai trò
- **Permissions**: Quyền hạn mới

### Thông tin trạng thái:
- **Is Active**: Trạng thái hoạt động
- **Status**: Trạng thái tài khoản
- **Updated At**: Thời gian cập nhật

### Thông tin cá nhân (nếu được phép):
- **First Name**: Tên
- **Last Name**: Họ
- **Email**: Địa chỉ email
- **Username**: Tên đăng nhập

## Các trường hợp lỗi

### Trường hợp lỗi:
1. **Form không hợp lệ**: Hiển thị lỗi validation
2. **User không tồn tại**: Hiển thị lỗi 404
3. **Cập nhật tài khoản của chính mình**: Hiển thị lỗi 400
4. **Lỗi database**: Hiển thị lỗi server
5. **Lỗi network**: Hiển thị thông báo lỗi

### Xử lý lỗi:
- **Self-protection**: Ngăn cập nhật tài khoản của chính mình
- **Form validation**: Kiểm tra dữ liệu đầu vào
- **Error handling**: Xử lý lỗi graceful
- **User feedback**: Thông báo lỗi rõ ràng

## Bảo mật và Validation

### Bảo mật:
- **Role-based authorization**: Chỉ Admin mới cập nhật được
- **JWT Authentication**: Yêu cầu token hợp lệ
- **Self-protection**: Không cho phép cập nhật tài khoản của chính mình
- **Data protection**: Bảo vệ thông tin nhạy cảm
- **Access control**: Kiểm soát quyền truy cập

### Validation:
- **Admin role validation**: Kiểm tra vai trò Admin
- **Token validation**: Kiểm tra JWT token
- **User validation**: Kiểm tra user tồn tại
- **Self-update prevention**: Ngăn cập nhật tài khoản của chính mình
- **Data validation**: Kiểm tra dữ liệu hợp lệ
- **Form validation**: Kiểm tra form trước khi gửi

## Cách sử dụng

### File chính:
- `UpdateUserAccount_Sequence_Diagram_Simplified.puml` - Sequence diagram cập nhật tài khoản người dùng

### Cách render:
1. Mở file `.puml` trong PlantUML editor
2. Hoặc sử dụng online PlantUML renderer
3. Diagram sẽ hiển thị quy trình cập nhật tài khoản người dùng

## Lưu ý quan trọng

1. **Admin role required**: Chỉ Admin mới có quyền cập nhật
2. **Self-protection**: Admin không thể cập nhật tài khoản của chính mình
3. **Role focus**: Tập trung vào thay đổi vai trò người dùng
4. **Modal interface**: Chỉnh sửa trong modal popup
5. **Real-time update**: Cập nhật danh sách ngay lập tức

## Khác biệt với các tính năng khác

### So với View User List:
- **Modification focus**: Tập trung vào chỉnh sửa thay vì xem
- **Form interaction**: Tương tác với form chỉnh sửa
- **Data update**: Cập nhật dữ liệu thay vì chỉ đọc
- **Validation required**: Yêu cầu validation dữ liệu

### So với View User Detail:
- **Edit mode**: Chế độ chỉnh sửa thay vì chỉ xem
- **Form submission**: Gửi form để cập nhật
- **Data modification**: Thay đổi dữ liệu thay vì chỉ hiển thị
- **Backend update**: Cập nhật database

### So với Update Profile:
- **Admin perspective**: Góc nhìn từ Admin
- **Other user data**: Cập nhật thông tin người dùng khác
- **Administrative purpose**: Mục đích quản trị
- **Role management**: Quản lý vai trò người dùng

## Đặc điểm độc đáo

### Admin-specific features:
- **Role management**: Quản lý vai trò người dùng
- **User administration**: Quản trị người dùng
- **System control**: Kiểm soát hệ thống
- **Administrative tools**: Công cụ quản trị

### Security features:
- **Self-protection**: Bảo vệ tài khoản của chính Admin
- **Role-based access**: Kiểm soát quyền truy cập
- **Data validation**: Kiểm tra dữ liệu nghiêm ngặt
- **Audit trail**: Theo dõi thay đổi

### User management capabilities:
- **Role assignment**: Gán vai trò cho người dùng
- **Status management**: Quản lý trạng thái tài khoản
- **Account control**: Kiểm soát tài khoản
- **System oversight**: Giám sát hệ thống 