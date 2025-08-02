# Sequence Diagram - Tính năng Đăng ký (Register Feature) - Phiên bản đơn giản

## Tổng quan
Sequence diagram này mô tả quy trình đăng ký 2 giai đoạn trong hệ thống Eduseen: đăng ký thông tin và xác thực OTP.

## Các thành phần tham gia (Participants)

### Frontend
- **Client**: Người dùng cuối tương tác với hệ thống
- **RegisterPage**: Giao diện đăng ký thông tin người dùng
- **VerifyOTPPage**: Giao diện nhập mã OTP xác thực

### Backend
- **RegisterController**: Bộ điều khiển xử lý đăng ký
- **VerifyOTPController**: Bộ điều khiển xử lý xác thực OTP
- **UserRepository**: Thành phần quản lý dữ liệu người dùng
- **OtpService**: Dịch vụ tạo và xác thực OTP
- **EmailService**: Dịch vụ gửi email
- **CacheService**: Dịch vụ lưu trữ dữ liệu tạm thời

## Luồng xử lý chi tiết

### Phase 1: Đăng ký thông tin

#### Bước 1: Nhập thông tin đăng ký
- **1: enter registration data**: Client nhập username, email, password, confirmPassword
- **2: submit registration request**: Client gửi yêu cầu đăng ký

#### Bước 2: Validation và kiểm tra
- **3: validate input data**: Kiểm tra format email, độ mạnh password, v.v.
- **4: checkEmailExists(email)**: Kiểm tra email đã tồn tại chưa
- **5: email exists (true/false)**: Trả về kết quả kiểm tra email

#### Bước 3: Xử lý điều kiện

##### Trường hợp 1: [Email not exists] (Email chưa tồn tại)
- **6: checkUsernameExists(username)**: Kiểm tra username đã tồn tại chưa
- **7: username exists (true/false)**: Trả về kết quả kiểm tra username

###### Trường hợp 1.1: [Username not exists] (Username chưa tồn tại)
- **8: generateOTP()**: Tạo mã OTP ngẫu nhiên
- **9: OTP code**: Trả về mã OTP
- **10: cacheRegistrationData(email, data)**: Lưu thông tin đăng ký vào cache
- **11: cached successfully**: Xác nhận lưu cache thành công
- **12: sendOTPEmail(email, OTP)**: Gửi email chứa mã OTP
- **13: email sent**: Xác nhận gửi email thành công
- **14: registration response (success)**: Trả về phản hồi đăng ký thành công
- **15: redirect to OTP verification**: Chuyển hướng đến trang xác thực OTP

###### Trường hợp 1.2: [Username exists] (Username đã tồn tại)
- Trả về lỗi "Username đã tồn tại"
- Hiển thị thông báo lỗi

##### Trường hợp 2: [Email exists] (Email đã tồn tại)
- Trả về lỗi "Email đã tồn tại"
- Hiển thị thông báo lỗi

### Phase 2: Xác thực OTP

#### Bước 1: Nhập mã OTP
- **16: enter OTP code**: Client nhập mã OTP từ email
- **17: submit OTP verification**: Client gửi yêu cầu xác thực OTP

#### Bước 2: Xác thực OTP
- **18: verifyOTP(email, OTP)**: Kiểm tra tính hợp lệ của OTP
- **19: OTP valid (true/false)**: Trả về kết quả xác thực

#### Bước 3: Xử lý điều kiện

##### Trường hợp 1: [OTP valid] (OTP hợp lệ)
- **20: getRegistrationData(email)**: Lấy thông tin đăng ký từ cache
- **21: registration data**: Trả về dữ liệu đăng ký
- **22: createUser(userData)**: Tạo tài khoản người dùng mới
- **23: hashPassword(password)**: Mã hóa mật khẩu
- **24: saveUserToDatabase()**: Lưu người dùng vào database
- **25: user created successfully**: Xác nhận tạo user thành công
- **26: clearRegistrationData(email)**: Xóa dữ liệu đăng ký khỏi cache
- **27: data cleared**: Xác nhận xóa cache thành công
- **28: verification response (success)**: Trả về phản hồi xác thực thành công
- **29: redirect to login page**: Chuyển hướng đến trang đăng nhập

##### Trường hợp 2: [OTP invalid] (OTP không hợp lệ)
- Trả về lỗi "OTP không hợp lệ"
- Hiển thị thông báo lỗi

## So sánh với hệ thống thực tế

### Mapping với hệ thống Eduseen:
- **RegisterPage** ↔ `RegisterForm` component
- **VerifyOTPPage** ↔ `VerifyOTPForm` component
- **RegisterController** ↔ `AuthController.RegisterAsync()`
- **VerifyOTPController** ↔ `AuthController.VerifyOtpAsync()`
- **UserRepository** ↔ `UserRepository.GetByEmailAsync()`, `UserRepository.CreateAsync()`
- **OtpService** ↔ `OtpService.SaveOtpAsync()`, `OtpService.VerifyOtpAsync()`
- **EmailService** ↔ `EmailService.SendEmailAsync()`
- **CacheService** ↔ `MemoryCache`

### Đặc điểm của hệ thống thực tế:
1. **2 giai đoạn**: Đăng ký → Xác thực OTP → Hoàn tất
2. **Cache tạm thời**: Lưu thông tin đăng ký trong 10 phút
3. **Email xác thực**: Gửi OTP qua email
4. **Bảo mật**: Hash password với BCrypt
5. **Validation**: Kiểm tra email, username, password strength

## Các trường hợp lỗi

### Phase 1 - Đăng ký:
1. **Email đã tồn tại**
2. **Username đã tồn tại**
3. **Dữ liệu không hợp lệ** (email format, password strength)
4. **Lỗi gửi email**

### Phase 2 - Xác thực OTP:
1. **OTP không hợp lệ**
2. **OTP đã hết hạn**
3. **Dữ liệu đăng ký không tìm thấy**
4. **Lỗi tạo user**

## Bảo mật và Validation

### Validation đầu vào:
- Email format hợp lệ
- Username: 3-50 ký tự, chỉ chữ cái, số, dấu gạch dưới
- Password: ít nhất 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt

### Bảo mật:
- Hash password với BCrypt
- OTP có thời hạn
- Cache có thời hạn
- Email xác thực

## Cách sử dụng

### File chính:
- `Register_Sequence_Diagram_Simplified.puml` - Sequence diagram đăng ký

### Cách render:
1. Mở file `.puml` trong PlantUML editor
2. Hoặc sử dụng online PlantUML renderer
3. Diagram sẽ hiển thị 2 phase của quy trình đăng ký

## Lưu ý quan trọng

1. **Quy trình 2 giai đoạn**: Đăng ký → Xác thực OTP
2. **Cache tạm thời**: Dữ liệu đăng ký được lưu tạm thời
3. **Email xác thực**: Bắt buộc xác thực qua email
4. **Bảo mật**: Mật khẩu được hash trước khi lưu
5. **User Experience**: Thông báo rõ ràng ở mỗi bước 