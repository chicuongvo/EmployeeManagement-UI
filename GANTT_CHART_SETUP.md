# Cài đặt thư viện Gantt Chart

Chạy lệnh sau để cài đặt thư viện gantt-task-react:

```bash
npm install gantt-task-react
```

hoặc nếu dùng yarn:

```bash
yarn add gantt-task-react
```

## Các tính năng đã được thêm:

### 1. **Chọn ngày bắt đầu và hạn hoàn thành**

- Form tạo/sửa task hiện có 2 trường date picker:
  - **Ngày bắt đầu** (Start Date)
  - **Hạn hoàn thành** (Due Date)

### 2. **Gantt Chart Timeline**

- Hiển thị timeline của các tasks dưới dạng Gantt chart
- Màu sắc theo mức độ ưu tiên:
  - 🔴 CRITICAL - Đỏ đậm
  - 🟠 HIGH - Cam đậm
  - 🟡 MEDIUM - Vàng
  - 🟢 LOW - Xanh lá
- Progress bar theo trạng thái:
  - TODO: 0%
  - IN_PROGRESS: 50%
  - IN_REVIEW: 75%
  - DONE: 100%
- Hỗ trợ nhiều chế độ xem:
  - Giờ (Hour)
  - Ngày (Day)
  - Tuần (Week)
  - Tháng (Month)

### 3. **Tabs Navigation**

- Tab "Danh sách": Hiển thị tasks dạng list như cũ
- Tab "Gantt Chart": Hiển thị timeline tasks

## Lưu ý:

- Chỉ những tasks có cả **start date** và **due date** mới hiển thị trong Gantt chart
- Tasks không có đầy đủ thông tin ngày sẽ hiển thị thông báo "Chưa có task nào có ngày bắt đầu và hạn hoàn thành"
