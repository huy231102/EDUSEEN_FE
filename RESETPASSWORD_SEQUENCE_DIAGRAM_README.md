# Sequence Diagram - Tính năng Đặt lại mật khẩu (Reset Password Feature) - Phiên bản rút gọn

## Tổng quan
Sequence diagram này mô tả quy trình đặt lại mật khẩu 2 giai đoạn một cách đơn giản: quên mật khẩu (gửi email) và đặt lại mật khẩu (thông qua link).

## Các thành phần tham gia (Participants)

### Frontend
- **Client**: Người dùng cuối tương tác với hệ thống
- **ForgotPasswordPage**: Giao diện nhập email để quên mật khẩu
- **ResetPasswordPage**: Giao diện đặt lại mật khẩu mới

### Backend
- **ForgotPasswordController**: Bộ điều khiển xử lý quên mật khẩu
- **ResetPasswordController**: Bộ điều khiển xử lý đặt lại mật khẩu
- **UserRepository**: Thành phần quản lý dữ liệu người dùng
- **EmailService**: Dịch vụ gửi email

## Luồng xử lý chi tiết

### Phase 1: Quên mật khẩu (Forgot Password)

#### Bước 1-2: Nhập email
- **1: enter email**: Client nhập email để yêu cầu đặt lại mật khẩu
- **2: submit request**: Client gửi yêu cầu quên mật khẩu

#### Bước 3-4: Tìm kiếm người dùng
- **3: findUserByEmail(email)**: Tìm kiếm người dùng theo email
- **4: user data**: Trả về thông tin người dùng

#### Bước 5-9: Xử lý thành công
- **5: generate reset token**: Tạo token đặt lại mật khẩu
- **6: send reset email**: Gửi email chứa link đặt lại mật khẩu
- **7: email sent**: Xác nhận gửi email thành công
- **8: success response**: Trả về phản hồi thành công
- **9: display success message**: Hiển thị thông báo thành công

### Phase 2: Đặt lại mật khẩu (Reset Password)

#### Bước 10-13: Truy cập và nhập thông tin
- **10: click reset link**: Client click vào link trong email
- **11: access reset page**: Truy cập trang đặt lại mật khẩu
- **12: enter new password**: Client nhập mật khẩu mới
- **13: submit reset request**: Client gửi yêu cầu đặt lại mật khẩu

#### Bước 14-18: Xử lý đặt lại mật khẩu
- **14: validate token**: Kiểm tra tính hợp lệ của token
- **15: update password**: Cập nhật mật khẩu trong database
- **16: password updated**: Xác nhận cập nhật thành công
- **17: success response**: Trả về phản hồi thành công
- **18: redirect to login**: Chuyển hướng đến trang đăng nhập

## So sánh với hệ thống thực tế

### Mapping với hệ thống Eduseen:
- **ForgotPasswordPage** ↔ `ForgotPasswordForm` component
- **ResetPasswordPage** ↔ `ResetPasswordForm` component
- **ForgotPasswordController** ↔ `AuthController.ForgotPassword()`
- **ResetPasswordController** ↔ `AuthController.ResetPassword()`
- **UserRepository** ↔ `UserRepository.GetByEmailAsync()`, `UserRepository.UpdateAsync()`
- **EmailService** ↔ `EmailService.SendEmailAsync()`

### Đặc điểm của hệ thống thực tế:
1. **2 giai đoạn**: Quên mật khẩu → Đặt lại mật khẩu
2. **Token có thời hạn**: Reset token hết hạn sau 15 phút
3. **Email xác thực**: Gửi link đặt lại qua email
4. **Bảo mật**: Hash password với BCrypt
5. **Security**: Không tiết lộ thông tin về email tồn tại

## Các trường hợp lỗi (được ẩn trong diagram đơn giản)

### Phase 1 - Quên mật khẩu:
- Email không tồn tại (nhưng trả về thành công vì bảo mật)
- Lỗi gửi email
- Lỗi tạo token

### Phase 2 - Đặt lại mật khẩu:
- Token không hợp lệ
- Token đã hết hạn
- Mật khẩu mới không hợp lệ
- Mật khẩu không khớp

## Bảo mật và Validation

### Bảo mật:
- **Token có thời hạn**: 15 phút
- **Token một lần**: Xóa sau khi sử dụng
- **Hash password**: BCrypt
- **Email xác thực**: Bắt buộc qua email
- **Security through obscurity**: Không tiết lộ email tồn tại

### Validation:
- **Email format**: Kiểm tra định dạng email
- **Password strength**: Kiểm tra độ mạnh mật khẩu mới
- **Token validation**: Kiểm tra token hợp lệ và chưa hết hạn

## Cách sử dụng

### File chính:
- `ResetPassword_Sequence_Diagram_Simplified.puml` - Sequence diagram đặt lại mật khẩu (rút gọn)

### Cách render:
1. Mở file `.puml` trong PlantUML editor
2. Hoặc sử dụng online PlantUML renderer
3. Diagram sẽ hiển thị 2 phase của quy trình đặt lại mật khẩu

## Lợi ích của phiên bản rút gọn

1. **Dễ hiểu**: Tập trung vào luồng chính, loại bỏ chi tiết phức tạp
2. **Phù hợp trình bày**: Tốt cho demo, training, documentation
3. **Dễ maintain**: Ít phức tạp, dễ cập nhật
4. **Tương thích**: Giống với format chuẩn trong ảnh mẫu

## Khi nào sử dụng phiên bản nào

### Sử dụng phiên bản rút gọn khi:
- Trình bày cho stakeholder
- Training cho developer mới
- Tài liệu tổng quan
- Demo hệ thống

### Sử dụng phiên bản chi tiết khi:
- Phát triển và debug
- Code review
- Tài liệu kỹ thuật chi tiết
- Phân tích hiệu suất

## Lưu ý quan trọng

1. **Quy trình 2 giai đoạn**: Quên mật khẩu → Đặt lại mật khẩu
2. **Token có thời hạn**: 15 phút
3. **Email xác thực**: Bắt buộc qua email
4. **Bảo mật cao**: Token một lần, hash password
5. **User Experience**: Thông báo rõ ràng ở mỗi bước 