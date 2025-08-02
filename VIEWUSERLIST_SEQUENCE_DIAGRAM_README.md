# Sequence Diagram - Tính năng Xem danh sách người dùng (View User List Feature) - Phiên bản đơn giản

## Tổng quan
Sequence diagram này mô tả quy trình xem danh sách người dùng trong hệ thống Eduseen, dành riêng cho Administrator để quản lý tất cả người dùng đã đăng ký.

## Các thành phần tham gia (Participants)

### Frontend
- **Admin**: Administrator truy cập hệ thống
- **AdminDashboard**: Giao diện quản trị viên

### Backend
- **AuthContext**: Context React quản lý trạng thái xác thực
- **AdminUserController**: Bộ điều khiển xử lý quản lý người dùng cho admin
- **UserService**: Service chứa logic nghiệp vụ quản lý người dùng
- **UserRepository**: Thành phần quản lý dữ liệu người dùng
- **Database**: Cơ sở dữ liệu lưu trữ thông tin

## Luồng xử lý chi tiết

### Bước 1: Truy cập admin dashboard
- **1: access admin dashboard**: Admin truy cập trang quản trị

### Bước 2: Xác thực admin
- **2: check admin authentication**: Kiểm tra trạng thái đăng nhập
- **3: verify admin role**: Xác thực vai trò Admin
- **4: admin user data**: Trả về thông tin admin từ context

### Bước 3: Xử lý điều kiện

#### Trường hợp 1: [Admin authenticated] (Admin đã xác thực)
- **5: load admin dashboard**: Tải giao diện quản trị
- **6: get all users request**: Gửi yêu cầu lấy danh sách tất cả người dùng
- **7: verify admin authorization**: Kiểm tra quyền Admin (Authorize(Roles = "Admin"))

### Bước 4: Xử lý backend
- **8: getAllUsersAsync()**: Gọi service lấy tất cả người dùng
- **9: getAllUsersWithRoleAsync()**: Tìm kiếm tất cả người dùng với thông tin vai trò
- **10: users list**: Trả về danh sách người dùng

### Bước 5: Format và hiển thị
- **11: format users data**: Định dạng dữ liệu người dùng
- **12: users response**: Trả về phản hồi danh sách người dùng
- **13: users list data**: Nhận dữ liệu danh sách người dùng từ backend
- **14: process and display users**: Xử lý và hiển thị danh sách người dùng
- **15: render user list table**: Render bảng danh sách người dùng

#### Trường hợp 2: [Not admin] (Không phải Admin)
- Chuyển hướng đến trang không được phép truy cập

## So sánh với hệ thống thực tế

### Mapping với hệ thống Eduseen:
- **AdminDashboard** ↔ `AdminDashboard` component
- **AuthContext** ↔ `AuthContext` (React Context)
- **AdminUserController** ↔ `AdminUserController.GetAllUsersForAdmin()`
- **UserService** ↔ `UserService.GetAllUsersAsync()`
- **UserRepository** ↔ `UserRepository.GetAllUsersWithRoleAsync()`
- **Database** ↔ SQL Server database

### Đặc điểm của hệ thống thực tế:
1. **Role-based access**: Chỉ Admin mới có quyền truy cập
2. **Comprehensive data**: Hiển thị tất cả thông tin người dùng
3. **Real-time data**: Lấy dữ liệu mới nhất từ database
4. **Advanced filtering**: Lọc theo nhiều tiêu chí
5. **Pagination**: Phân trang cho danh sách lớn

## Thông tin hiển thị

### Thông tin cơ bản:
- **ID**: Mã người dùng
- **Họ và tên**: FirstName + LastName
- **Email**: Địa chỉ email
- **Username**: Tên đăng nhập
- **Role**: Vai trò trong hệ thống
- **Status**: Trạng thái hoạt động
- **Joined Date**: Ngày tham gia
- **Last Active**: Lần hoạt động cuối
- **Avatar**: Ảnh đại diện

### Thông tin bổ sung:
- **User Statistics**: Thống kê người dùng
- **Filter Options**: Tùy chọn lọc
- **Search Functionality**: Chức năng tìm kiếm
- **Pagination**: Phân trang

## Các trường hợp lỗi

### Trường hợp lỗi:
1. **Không phải Admin**: Chuyển hướng đến trang unauthorized
2. **Token không hợp lệ**: Chuyển hướng đến login
3. **Lỗi database**: Hiển thị lỗi server
4. **Lỗi network**: Sử dụng fallback data

### Xử lý lỗi:
- **Role validation**: Kiểm tra vai trò trước
- **Error handling**: Xử lý lỗi graceful
- **Fallback mechanism**: Sử dụng mock data khi cần
- **User feedback**: Thông báo lỗi rõ ràng

## Bảo mật và Validation

### Bảo mật:
- **Role-based authorization**: Chỉ Admin mới truy cập được
- **JWT Authentication**: Yêu cầu token hợp lệ
- **Data protection**: Bảo vệ thông tin nhạy cảm
- **Access control**: Kiểm soát quyền truy cập

### Validation:
- **Admin role validation**: Kiểm tra vai trò Admin
- **Token validation**: Kiểm tra JWT token
- **Data validation**: Kiểm tra dữ liệu hợp lệ
- **Authorization check**: Kiểm tra quyền truy cập

## Cách sử dụng

### File chính:
- `ViewUserList_Sequence_Diagram_Simplified.puml` - Sequence diagram xem danh sách người dùng

### Cách render:
1. Mở file `.puml` trong PlantUML editor
2. Hoặc sử dụng online PlantUML renderer
3. Diagram sẽ hiển thị quy trình xem danh sách người dùng

## Lưu ý quan trọng

1. **Admin role required**: Chỉ Admin mới có quyền truy cập
2. **Comprehensive data**: Hiển thị tất cả thông tin người dùng
3. **Real-time sync**: Dữ liệu được cập nhật real-time
4. **Advanced features**: Lọc, tìm kiếm, phân trang
5. **Security focus**: Bảo mật cao cho dữ liệu nhạy cảm

## Khác biệt với các tính năng khác

### So với View Profile:
- **Admin access**: Chỉ Admin mới truy cập được
- **All users data**: Xem tất cả người dùng thay vì chỉ mình
- **Management focus**: Tập trung vào quản lý
- **Advanced features**: Nhiều tính năng nâng cao

### So với Login:
- **Read-only**: Chỉ đọc dữ liệu, không tạo mới
- **Admin specific**: Dành riêng cho Admin
- **Comprehensive view**: Xem toàn bộ hệ thống

### So với Register:
- **No creation**: Không tạo người dùng mới
- **Admin perspective**: Góc nhìn từ Admin
- **System overview**: Tổng quan hệ thống

## Đặc điểm độc đáo

### Admin-specific features:
- **Role-based access**: Chỉ Admin mới truy cập được
- **System management**: Quản lý toàn bộ hệ thống
- **User oversight**: Giám sát tất cả người dùng
- **Advanced analytics**: Thống kê và phân tích

### Comprehensive data display:
- **All users**: Hiển thị tất cả người dùng
- **Detailed information**: Thông tin chi tiết
- **Real-time updates**: Cập nhật real-time
- **Advanced filtering**: Lọc nâng cao 