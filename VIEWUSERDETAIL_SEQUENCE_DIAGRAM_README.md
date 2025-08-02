# Sequence Diagram - Tính năng Xem chi tiết người dùng (View User Detail Feature) - Phiên bản đơn giản

## Tổng quan
Sequence diagram này mô tả quy trình xem chi tiết người dùng trong hệ thống Eduseen, dành riêng cho Administrator để xem thông tin chi tiết của một người dùng cụ thể, bao gồm thông tin cá nhân, vai trò, lịch sử hoạt động và lịch sử đăng ký khóa học.

## Các thành phần tham gia (Participants)

### Frontend
- **Admin**: Administrator truy cập hệ thống
- **AdminDashboard**: Giao diện quản trị viên

### Backend
- **AuthContext**: Context React quản lý trạng thái xác thực
- **UserController**: Bộ điều khiển xử lý thông tin người dùng
- **UserService**: Service chứa logic nghiệp vụ quản lý người dùng
- **UserRepository**: Thành phần quản lý dữ liệu người dùng
- **Database**: Cơ sở dữ liệu lưu trữ thông tin

## Luồng xử lý chi tiết

### Bước 1: Chọn người dùng
- **1: select user from list**: Admin chọn người dùng từ danh sách
- **2: click view detail button**: Admin click nút xem chi tiết

### Bước 2: Xác thực admin
- **3: check admin authentication**: Kiểm tra trạng thái đăng nhập
- **4: verify admin role**: Xác thực vai trò Admin
- **5: admin user data**: Trả về thông tin admin từ context

### Bước 3: Xử lý điều kiện

#### Trường hợp 1: [Admin authenticated] (Admin đã xác thực)
- **6: open user detail modal**: Mở modal chi tiết người dùng
- **7: getUserById request**: Gửi yêu cầu lấy thông tin chi tiết người dùng
- **8: verify admin authorization**: Kiểm tra quyền Admin (Authorize(Roles = "Admin"))

### Bước 4: Xử lý backend
- **9: getUserByIdAsync(userId)**: Gọi service lấy thông tin chi tiết người dùng
- **10: getUserByIdWithRoleAsync(userId)**: Tìm kiếm thông tin người dùng với chi tiết vai trò
- **11: user detail data**: Trả về dữ liệu chi tiết người dùng

### Bước 5: Format và hiển thị
- **12: format user detail data**: Định dạng dữ liệu chi tiết người dùng
- **13: user detail response**: Trả về phản hồi chi tiết người dùng
- **14: user detail data**: Nhận dữ liệu chi tiết từ backend
- **15: display user detail information**: Hiển thị thông tin chi tiết người dùng
- **16: render user detail modal**: Render modal chi tiết người dùng

#### Trường hợp 2: [Not admin] (Không phải Admin)
- Chuyển hướng đến trang không được phép truy cập

## So sánh với hệ thống thực tế

### Mapping với hệ thống Eduseen:
- **AdminDashboard** ↔ `AdminDashboard` component
- **AuthContext** ↔ `AuthContext` (React Context)
- **UserController** ↔ `UserController.GetUserByIdAsync()`
- **UserService** ↔ `UserService.GetUserByIdAsync()`
- **UserRepository** ↔ `UserRepository.GetUserByIdWithRoleAsync()`
- **Database** ↔ SQL Server database

### Đặc điểm của hệ thống thực tế:
1. **Role-based access**: Chỉ Admin mới có quyền truy cập
2. **Detailed information**: Hiển thị thông tin chi tiết toàn diện
3. **Real-time data**: Lấy dữ liệu mới nhất từ database
4. **Modal interface**: Hiển thị trong modal popup
5. **Comprehensive view**: Xem tất cả thông tin liên quan

## Thông tin hiển thị

### Thông tin cá nhân:
- **ID**: Mã người dùng
- **Họ và tên**: FirstName + LastName
- **Email**: Địa chỉ email
- **Username**: Tên đăng nhập
- **Avatar**: Ảnh đại diện
- **Ngày tạo**: CreatedAt
- **Cập nhật cuối**: UpdatedAt

### Thông tin vai trò:
- **Role ID**: Mã vai trò
- **Role Name**: Tên vai trò
- **Permissions**: Quyền hạn
- **Status**: Trạng thái hoạt động

### Lịch sử hoạt động:
- **Last Login**: Lần đăng nhập cuối
- **Login Count**: Số lần đăng nhập
- **Activity Logs**: Nhật ký hoạt động
- **Session History**: Lịch sử phiên làm việc

### Lịch sử đăng ký khóa học:
- **Enrolled Courses**: Khóa học đã đăng ký
- **Completed Courses**: Khóa học đã hoàn thành
- **Course Progress**: Tiến độ khóa học
- **Certificates**: Chứng chỉ đạt được

### Thông tin bổ sung:
- **User Statistics**: Thống kê người dùng
- **Performance Metrics**: Chỉ số hiệu suất
- **System Logs**: Nhật ký hệ thống
- **Admin Notes**: Ghi chú của admin

## Các trường hợp lỗi

### Trường hợp lỗi:
1. **Không phải Admin**: Chuyển hướng đến trang unauthorized
2. **Token không hợp lệ**: Chuyển hướng đến login
3. **User không tồn tại**: Hiển thị lỗi 404
4. **Lỗi database**: Hiển thị lỗi server
5. **Lỗi network**: Hiển thị thông báo lỗi

### Xử lý lỗi:
- **Role validation**: Kiểm tra vai trò trước
- **Error handling**: Xử lý lỗi graceful
- **User feedback**: Thông báo lỗi rõ ràng
- **Fallback mechanism**: Hiển thị thông tin cơ bản nếu có

## Bảo mật và Validation

### Bảo mật:
- **Role-based authorization**: Chỉ Admin mới truy cập được
- **JWT Authentication**: Yêu cầu token hợp lệ
- **Data protection**: Bảo vệ thông tin nhạy cảm
- **Access control**: Kiểm soát quyền truy cập

### Validation:
- **Admin role validation**: Kiểm tra vai trò Admin
- **Token validation**: Kiểm tra JWT token
- **User validation**: Kiểm tra user tồn tại
- **Data validation**: Kiểm tra dữ liệu hợp lệ

## Cách sử dụng

### File chính:
- `ViewUserDetail_Sequence_Diagram_Simplified.puml` - Sequence diagram xem chi tiết người dùng

### Cách render:
1. Mở file `.puml` trong PlantUML editor
2. Hoặc sử dụng online PlantUML renderer
3. Diagram sẽ hiển thị quy trình xem chi tiết người dùng

## Lưu ý quan trọng

1. **Admin role required**: Chỉ Admin mới có quyền truy cập
2. **Comprehensive data**: Hiển thị thông tin chi tiết toàn diện
3. **Real-time sync**: Dữ liệu được cập nhật real-time
4. **Modal interface**: Hiển thị trong modal popup
5. **Security focus**: Bảo mật cao cho dữ liệu nhạy cảm

## Khác biệt với các tính năng khác

### So với View User List:
- **Single user focus**: Tập trung vào một người dùng cụ thể
- **Detailed information**: Thông tin chi tiết hơn
- **Modal interface**: Hiển thị trong modal thay vì trang riêng
- **Comprehensive data**: Bao gồm lịch sử và thống kê

### So với View Profile:
- **Admin perspective**: Góc nhìn từ Admin
- **Other user data**: Xem thông tin người dùng khác
- **Administrative purpose**: Mục đích quản trị
- **Enhanced features**: Tính năng nâng cao hơn

### So với Login:
- **Read-only**: Chỉ đọc dữ liệu, không tạo mới
- **Admin specific**: Dành riêng cho Admin
- **Detailed view**: Xem chi tiết thay vì xác thực

## Đặc điểm độc đáo

### Admin-specific features:
- **Role-based access**: Chỉ Admin mới truy cập được
- **User management**: Quản lý thông tin người dùng
- **Comprehensive oversight**: Giám sát toàn diện
- **Administrative tools**: Công cụ quản trị

### Detailed information display:
- **Personal information**: Thông tin cá nhân chi tiết
- **Activity history**: Lịch sử hoạt động
- **Enrollment data**: Dữ liệu đăng ký khóa học
- **System logs**: Nhật ký hệ thống
- **Performance metrics**: Chỉ số hiệu suất 