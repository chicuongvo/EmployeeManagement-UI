# Packages cần cài đặt cho UpdateRequest Data Table

Để sử dụng trang UpdateRequest với data-table, bạn cần cài đặt các packages sau:

## 1. TanStack Table

```bash
npm install @tanstack/react-table
```

## 2. Radix UI Components

Các components UI sử dụng Radix UI primitives:

```bash
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-select
```

## 3. Tất cả packages cùng lúc

```bash
npm install @tanstack/react-table @radix-ui/react-checkbox @radix-ui/react-dropdown-menu @radix-ui/react-select
```

## Lưu ý

- Các packages khác như `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react` đã có trong package.json
- Đảm bảo đã cấu hình Tailwind CSS với các CSS variables cho shadcn/ui (đã có trong index.css)
