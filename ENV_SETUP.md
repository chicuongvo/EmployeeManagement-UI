# Hướng dẫn cấu hình Environment Variables cho Frontend

## Các biến môi trường cần thiết

Frontend cần cấu hình các biến môi trường sau:

### 1. VITE_API_BASE_URL

URL của backend API server.

**Cách cấu hình:**

1. Tạo file `.env` trong thư mục `EmployeeManagement-UI` (nếu chưa có)

2. Thêm vào file `.env`:

```env
# API Base URL - Backend Server URL
VITE_API_BASE_URL=http://localhost:5001/api
```

### 2. Ví dụ cho các môi trường khác nhau

#### Development (Local):
```env
VITE_API_BASE_URL=http://localhost:5001/api
```

#### Production:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

#### Staging:
```env
VITE_API_BASE_URL=https://staging-api.your-domain.com/api
```

## Lưu ý quan trọng

1. **Vite yêu cầu prefix `VITE_`**: Tất cả biến môi trường dùng trong frontend phải có prefix `VITE_`

2. **Restart dev server**: Sau khi thay đổi file `.env`, cần restart dev server:
   ```bash
   npm run dev
   # hoặc
   yarn dev
   ```

3. **File `.env` không commit lên git**: File `.env` đã được thêm vào `.gitignore` để bảo mật

4. **File `.env.example`**: Có thể tạo file `.env.example` để làm mẫu (không chứa giá trị thật)

## Cách tạo file .env

### Windows (PowerShell):
```powershell
cd EmployeeManagement-UI
New-Item -Path .env -ItemType File -Force
```

Sau đó mở file `.env` và thêm nội dung:
```env
VITE_API_BASE_URL=http://localhost:5001/api
```

### Linux/Mac:
```bash
cd EmployeeManagement-UI
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:5001/api
EOF
```

Hoặc tạo file thủ công và thêm nội dung vào.

## Kiểm tra cấu hình

Sau khi cấu hình, kiểm tra bằng cách:

1. Khởi động dev server:
   ```bash
   npm run dev
   ```

2. Mở browser console và kiểm tra network requests - URL phải trỏ đúng đến backend

3. Thử đăng nhập - nếu thành công là đã cấu hình đúng

## Troubleshooting

### Lỗi: "Cannot read property 'VITE_API_BASE_URL' of undefined"

**Nguyên nhân**: File `.env` chưa được tạo hoặc biến chưa được cấu hình

**Giải pháp**: 
- Kiểm tra file `.env` đã tồn tại trong thư mục `EmployeeManagement-UI`
- Kiểm tra tên biến có đúng `VITE_API_BASE_URL` không (phải có prefix `VITE_`)
- Restart dev server sau khi tạo/sửa file `.env`

### Lỗi: "Network Error" hoặc "CORS Error"

**Nguyên nhân**: Backend chưa chạy hoặc URL không đúng

**Giải pháp**:
- Kiểm tra backend đang chạy trên port 5001
- Kiểm tra `VITE_API_BASE_URL` trong file `.env` có đúng không
- Kiểm tra CORS settings trên backend

