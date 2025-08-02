# Sequence Diagram - Tính năng Đăng nhập (Login Feature) - Phiên bản đơn giản

## Tổng quan
Sequence diagram này mô tả quy trình đăng nhập một cách đơn giản và dễ hiểu, tương tự như ảnh mẫu bạn cung cấp.

## Các thành phần tham gia (Participants)

### Frontend
- **Client**: Người dùng cuối tương tác với hệ thống
- **LoginPage**: Giao diện người dùng để nhập thông tin đăng nhập

### Backend
- **LoginController**: Bộ điều khiển xử lý logic đăng nhập
- **UserRepository**: Thành phần quản lý dữ liệu người dùng
- **UserAdmin**: Thành phần kiểm tra thông tin người dùng và mật khẩu
- **JwtService**: Dịch vụ tạo và quản lý JSON Web Token (JWT)
- **CacheService**: Dịch vụ lưu trữ dữ liệu vào bộ nhớ đệm

## Luồng xử lý chi tiết

### 1. Bắt đầu quy trình
- **1: enter credentials**: Client nhập thông tin đăng nhập (email/username và mật khẩu) vào LoginPage
- **2: submit login request**: Client gửi yêu cầu đăng nhập từ LoginPage đến LoginController

### 2. Tìm kiếm người dùng
- **3: findByEmail**: LoginController yêu cầu UserRepository tìm kiếm người dùng dựa trên email
- **4: user data returned**: UserRepository trả về dữ liệu người dùng (nếu tìm thấy) cho LoginController

### 3. Xử lý điều kiện

#### Trường hợp 1: [User exists] (Người dùng tồn tại)
- **5: checkPassword**: LoginController gửi yêu cầu kiểm tra mật khẩu đến UserAdmin

##### Trường hợp 1.1: [Password correct] (Mật khẩu đúng)
- **6: generateToken**: LoginController yêu cầu JwtService tạo một token xác thực
- **7: token**: JwtService trả về token cho LoginController
- **8: caching user data**: LoginController gửi yêu cầu CacheService lưu trữ dữ liệu người dùng vào bộ nhớ đệm
- **9: login response**: LoginController gửi phản hồi đăng nhập thành công về LoginPage
- **12: redirect to dashboard**: LoginPage chuyển hướng Client đến trang dashboard

##### Trường hợp 1.2: [Password incorrect] (Mật khẩu sai)
- **10: error - wrong password**: LoginController gửi thông báo lỗi "mật khẩu sai" về LoginPage

#### Trường hợp 2: [User not found] (Người dùng không tồn tại)
- **11: error - user not found**: LoginController gửi thông báo lỗi "người dùng không tồn tại" về LoginPage

## So sánh với hệ thống thực tế

### Mapping với hệ thống Eduseen:
- **LoginPage** ↔ `LoginForm` component
- **LoginController** ↔ `AuthController.LoginAsync()`
- **UserRepository** ↔ `UserRepository.GetByEmailAsync()`
- **UserAdmin** ↔ `UserRepository.CheckPasswordAsync()`
- **JwtService** ↔ `TokenService.CreateJWTTokenAsync()`
- **CacheService** ↔ `MemoryCache` (nếu sử dụng)

### Điểm khác biệt:
1. **Đơn giản hóa**: Loại bỏ các chi tiết phức tạp như AuthService, AuthContext, userApi
2. **Tập trung**: Chỉ hiển thị các bước chính trong quy trình đăng nhập
3. **Dễ hiểu**: Sử dụng tên gọi đơn giản và trực quan

## Cách sử dụng

### File chính:
- `Login_Sequence_Diagram.puml` - Phiên bản chi tiết đầy đủ
- `Login_Sequence_Diagram_Simplified.puml` - Phiên bản đơn giản (như ảnh mẫu)

### Cách render:
1. Mở file `.puml` trong PlantUML editor
2. Hoặc sử dụng online PlantUML renderer
3. Chọn phiên bản phù hợp với nhu cầu

## Lợi ích của phiên bản đơn giản

1. **Dễ hiểu**: Tập trung vào luồng chính, không bị phân tâm bởi chi tiết
2. **Phù hợp trình bày**: Tốt cho demo, training, documentation
3. **Dễ maintain**: Ít phức tạp, dễ cập nhật khi có thay đổi
4. **Tương thích**: Giống với format chuẩn trong ảnh mẫu

## Khi nào sử dụng phiên bản nào

### Sử dụng phiên bản đơn giản khi:
- Trình bày cho stakeholder
- Training cho developer mới
- Tài liệu tổng quan
- Demo hệ thống

### Sử dụng phiên bản chi tiết khi:
- Phát triển và debug
- Code review
- Tài liệu kỹ thuật chi tiết
- Phân tích hiệu suất 