# Sequence Diagram - Tính năng Đăng xuất (Logout Feature) - Phiên bản đơn giản

## Tổng quan
Sequence diagram này mô tả quy trình đăng xuất trong hệ thống Eduseen, bao gồm việc xóa token và dữ liệu người dùng khỏi cả frontend và backend.

## Các thành phần tham gia (Participants)

### Frontend
- **Client**: Người dùng cuối tương tác với hệ thống
- **LogoutPage**: Giao diện nơi người dùng thực hiện đăng xuất

### Backend
- **LogoutController**: Bộ điều khiển xử lý đăng xuất
- **AuthContext**: Context React quản lý trạng thái xác thực
- **TokenService**: Dịch vụ quản lý token và cookie
- **UserRepository**: Thành phần quản lý dữ liệu người dùng

## Luồng xử lý chi tiết

### Bước 1: Khởi tạo đăng xuất
- **1: click logout button**: Client click vào nút đăng xuất

### Bước 2: Xử lý frontend
- **2: logout()**: Gọi hàm logout từ AuthContext
- **3: clear token from storage**: Xóa JWT token khỏi localStorage
- **4: clear user data from storage**: Xóa thông tin người dùng khỏi localStorage
- **5: logout completed**: Xác nhận đăng xuất frontend hoàn tất

### Bước 3: Xử lý backend
- **6: submit logout request**: Gửi yêu cầu đăng xuất đến backend
- **7: extract user ID from token**: Lấy user ID từ JWT token

### Bước 4: Xác thực và xử lý
- **8: getUserById(userId)**: Tìm kiếm thông tin người dùng
- **9: user data**: Trả về thông tin người dùng

### Bước 5: Xử lý điều kiện

#### Trường hợp 1: [User exists] (Người dùng tồn tại)
- **10: deleteTokenCookie()**: Xóa HTTP-only cookie
- **11: clear HTTP-only cookie**: Xóa cookie chứa token
- **12: cookie deleted**: Xác nhận xóa cookie thành công
- **13: logout response (success)**: Trả về phản hồi đăng xuất thành công
- **14: redirect to login page**: Chuyển hướng đến trang đăng nhập

#### Trường hợp 2: [User not found] (Người dùng không tồn tại)
- Trả về phản hồi đăng xuất thành công
- Chuyển hướng đến trang đăng nhập

## So sánh với hệ thống thực tế

### Mapping với hệ thống Eduseen:
- **LogoutPage** ↔ `ProfilePage`, `AdminDashboard` (nơi có nút logout)
- **LogoutController** ↔ `AuthController.LogoutAsync()`
- **AuthContext** ↔ `AuthContext.logout()`
- **TokenService** ↔ `TokenService.DeleteTokenCookie()`
- **UserRepository** ↔ `UserRepository.GetByIdAsync()`

### Đặc điểm của hệ thống thực tế:
1. **Xác thực JWT**: Lấy user ID từ JWT token
2. **Xóa cookie**: Xóa HTTP-only cookie chứa token
3. **Xóa localStorage**: Xóa token và user data khỏi frontend
4. **Redirect**: Chuyển hướng về trang đăng nhập
5. **Logging**: Ghi log hoạt động đăng xuất

## Các trường hợp lỗi

### Trường hợp lỗi:
1. **User không tồn tại**: Vẫn đăng xuất thành công
2. **Token không hợp lệ**: Vẫn xóa dữ liệu frontend
3. **Lỗi network**: Frontend vẫn xóa dữ liệu local

### Xử lý lỗi:
- **Graceful degradation**: Luôn xóa dữ liệu frontend
- **User experience**: Không hiển thị lỗi cho user
- **Security**: Đảm bảo user được đăng xuất

## Bảo mật và Validation

### Bảo mật:
- **Xóa token**: Xóa JWT token khỏi localStorage
- **Xóa cookie**: Xóa HTTP-only cookie
- **Xóa user data**: Xóa thông tin người dùng
- **Redirect**: Chuyển hướng về trang đăng nhập

### Validation:
- **Token validation**: Kiểm tra token hợp lệ
- **User validation**: Kiểm tra user tồn tại
- **Cookie cleanup**: Đảm bảo xóa cookie

## Cách sử dụng

### File chính:
- `Logout_Sequence_Diagram_Simplified.puml` - Sequence diagram đăng xuất

### Cách render:
1. Mở file `.puml` trong PlantUML editor
2. Hoặc sử dụng online PlantUML renderer
3. Diagram sẽ hiển thị quy trình đăng xuất

## Lưu ý quan trọng

1. **Xác thực bắt buộc**: Người dùng phải đăng nhập trước
2. **Xóa dữ liệu**: Cả frontend và backend
3. **User Experience**: Chuyển hướng mượt mà
4. **Security**: Đảm bảo đăng xuất hoàn toàn
5. **Error Handling**: Xử lý lỗi graceful

## Khác biệt với các tính năng khác

### So với Login:
- **Ngược lại**: Xóa token thay vì tạo token
- **Xóa dữ liệu**: Thay vì lưu dữ liệu
- **Redirect**: Về trang đăng nhập

### So với Register:
- **Không tạo gì mới**: Chỉ xóa dữ liệu hiện có
- **Không cần validation**: Chỉ cần xác thực
- **Quy trình đơn giản**: Ít bước hơn

### So với Change Password:
- **Không cập nhật**: Chỉ xóa dữ liệu
- **Không yêu cầu mật khẩu**: Chỉ cần xác thực
- **Quy trình ngắn**: Ít bước hơn

## Đặc điểm độc đáo

### Frontend-first approach:
- **Xóa dữ liệu frontend trước**: Đảm bảo UX
- **Backend cleanup sau**: Đảm bảo security
- **Graceful handling**: Xử lý lỗi mượt mà

### Security considerations:
- **Token invalidation**: Xóa token hoàn toàn
- **Cookie cleanup**: Xóa HTTP-only cookie
- **Data cleanup**: Xóa tất cả dữ liệu user 