# Sequence Diagram - Tính năng Cập nhật thông tin cá nhân (Update Profile Feature) - Phiên bản đơn giản

## Tổng quan
Sequence diagram này mô tả quy trình cập nhật thông tin cá nhân trong hệ thống Eduseen, bao gồm việc xác thực người dùng, validation dữ liệu và cập nhật thông tin profile.

## Các thành phần tham gia (Participants)

### Frontend
- **Client**: Người dùng cuối tương tác với hệ thống
- **ProfilePage**: Giao diện cập nhật thông tin cá nhân

### Backend
- **AuthContext**: Context React quản lý trạng thái xác thực
- **ProfileController**: Bộ điều khiển xử lý profile
- **ProfileService**: Service chứa logic nghiệp vụ profile
- **UserRepository**: Thành phần quản lý dữ liệu người dùng
- **Database**: Cơ sở dữ liệu lưu trữ thông tin

## Luồng xử lý chi tiết

### Bước 1: Nhập và gửi dữ liệu
- **1: modify profile data**: Client chỉnh sửa thông tin cá nhân
- **2: submit update request**: Client gửi yêu cầu cập nhật

### Bước 2: Validation frontend
- **3: validate input data**: Kiểm tra dữ liệu đầu vào (required fields, format, v.v.)

### Bước 3: Xử lý điều kiện

#### Trường hợp 1: [Data valid] (Dữ liệu hợp lệ)
- **4: update profile request**: Gửi yêu cầu cập nhật profile
- **5: extract user ID from token**: Lấy user ID từ JWT token
- **6: validate request data**: Kiểm tra dữ liệu request (ModelState.IsValid)

##### Trường hợp 1.1: [Request valid] (Request hợp lệ)
- **7: updateProfileAsync(profileData)**: Gọi service cập nhật profile
- **8: getUserById(userId)**: Tìm kiếm thông tin người dùng
- **9: user object**: Trả về thông tin người dùng

###### Trường hợp 1.1.1: [User exists] (Người dùng tồn tại)
- **10: validate profile data**: Kiểm tra dữ liệu profile (format, length, v.v.)

####### Trường hợp 1.1.1.1: [Profile data valid] (Dữ liệu profile hợp lệ)
- **11: updateUser(userId, profileData)**: Cập nhật thông tin người dùng
- **12: user updated**: Xác nhận cập nhật thành công
- **13: update response (success)**: Trả về phản hồi cập nhật thành công
- **14: profile updated response**: Nhận phản hồi từ backend
- **15: update user context**: Cập nhật context với dữ liệu mới
- **16: update user data in context**: Cập nhật dữ liệu user trong context
- **17: context updated**: Xác nhận cập nhật context thành công
- **18: display success message**: Hiển thị thông báo thành công
- **19: refresh profile display**: Làm mới hiển thị profile

####### Trường hợp 1.1.1.2: [Profile data invalid] (Dữ liệu profile không hợp lệ)
- Trả về lỗi "Dữ liệu profile không hợp lệ"
- Hiển thị thông báo lỗi validation

###### Trường hợp 1.1.2: [User not found] (Người dùng không tồn tại)
- Trả về lỗi "Người dùng không tìm thấy"
- Hiển thị thông báo lỗi

##### Trường hợp 1.2: [Request invalid] (Request không hợp lệ)
- Trả về lỗi "Dữ liệu request không hợp lệ"
- Hiển thị thông báo lỗi validation

#### Trường hợp 2: [Data invalid] (Dữ liệu không hợp lệ)
- Hiển thị lỗi validation

## So sánh với hệ thống thực tế

### Mapping với hệ thống Eduseen:
- **ProfilePage** ↔ `ProfilePage` component
- **AuthContext** ↔ `AuthContext` (React Context)
- **ProfileController** ↔ `ProfileController.UpdateProfileAsync()`
- **ProfileService** ↔ `ProfileService.UpdateProfileAsync()`
- **UserRepository** ↔ `UserRepository.GetByIdAsync()`, `UserRepository.UpdateAsync()`
- **Database** ↔ SQL Server database

### Đặc điểm của hệ thống thực tế:
1. **Xác thực JWT**: Yêu cầu đăng nhập để cập nhật profile
2. **Multi-level validation**: Validation ở nhiều cấp độ
3. **Context update**: Cập nhật React Context sau khi thành công
4. **Real-time sync**: Đồng bộ dữ liệu real-time
5. **User feedback**: Thông báo rõ ràng cho user

## Thông tin có thể cập nhật

### Thông tin cơ bản:
- **FirstName**: Tên
- **LastName**: Họ
- **AvatarUrl**: URL ảnh đại diện

### Thông tin không thể cập nhật:
- **Username**: Tên đăng nhập (không thay đổi)
- **Email**: Địa chỉ email (không thay đổi)
- **Role**: Vai trò (không thay đổi)

## Các trường hợp lỗi

### Validation lỗi:
1. **Dữ liệu không hợp lệ** (format, length, required fields)
2. **Request không hợp lệ** (ModelState.IsValid = false)
3. **Dữ liệu profile không hợp lệ** (backend validation)
4. **Người dùng không tồn tại**

### Xử lý lỗi:
- **Multi-level validation**: Kiểm tra ở nhiều cấp độ
- **User feedback**: Thông báo lỗi rõ ràng
- **Graceful handling**: Xử lý lỗi graceful
- **Context preservation**: Giữ nguyên context nếu lỗi

## Bảo mật và Validation

### Bảo mật:
- **JWT Authentication**: Yêu cầu token hợp lệ
- **Authorization**: Chỉ cập nhật được thông tin của mình
- **Data validation**: Kiểm tra dữ liệu nghiêm ngặt
- **Input sanitization**: Làm sạch dữ liệu đầu vào

### Validation:
- **Frontend validation**: Kiểm tra ở client-side
- **Backend validation**: Kiểm tra ở server-side
- **Model validation**: Kiểm tra ModelState
- **Business logic validation**: Kiểm tra logic nghiệp vụ

## Cách sử dụng

### File chính:
- `UpdateProfile_Sequence_Diagram_Simplified.puml` - Sequence diagram cập nhật profile

### Cách render:
1. Mở file `.puml` trong PlantUML editor
2. Hoặc sử dụng online PlantUML renderer
3. Diagram sẽ hiển thị quy trình cập nhật profile

## Lưu ý quan trọng

1. **Xác thực bắt buộc**: Người dùng phải đăng nhập
2. **Multi-level validation**: Kiểm tra ở nhiều cấp độ
3. **Context update**: Cập nhật React Context sau khi thành công
4. **User Experience**: Thông báo rõ ràng cho user
5. **Data integrity**: Đảm bảo tính toàn vẹn dữ liệu

## Khác biệt với các tính năng khác

### So với View Profile:
- **Write operation**: Thay vì chỉ đọc
- **Validation required**: Cần validation nghiêm ngặt
- **Context update**: Cập nhật context sau khi thành công
- **Complex flow**: Quy trình phức tạp hơn

### So với Login:
- **Không tạo token**: Chỉ sử dụng token hiện có
- **Update operation**: Thay vì tạo mới
- **Validation focus**: Tập trung vào validation

### So với Register:
- **Không tạo user mới**: Chỉ cập nhật thông tin
- **Authentication required**: Yêu cầu đăng nhập
- **Limited fields**: Chỉ cập nhật một số trường

## Đặc điểm độc đáo

### Multi-level validation:
- **Frontend validation**: Kiểm tra ở client-side
- **Backend validation**: Kiểm tra ở server-side
- **Model validation**: Kiểm tra ModelState
- **Business validation**: Kiểm tra logic nghiệp vụ

### Context synchronization:
- **Real-time update**: Cập nhật context ngay lập tức
- **State management**: Quản lý state tập trung
- **User experience**: Hiển thị thay đổi ngay lập tức 