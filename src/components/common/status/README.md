# WorkStatus Components

## Components

### 1. WorkStatus (Display Component)
Component để hiển thị trạng thái làm việc với màu sắc và label phù hợp.

**Location:** `src/components/common/status/WorkStatus.tsx`

**Usage:**
```tsx
import { WorkStatus } from "@/components/common/status";

// In your component
<WorkStatus status="WORKING_ONSITE" />
<WorkStatus status="RESIGNED" />
<WorkStatus status="ON_LEAVE_SICK" />
```

**Props:**
- `status` (required): WorkStatus type
- `size` (optional): "small" | "default" | "large"

### 2. SelectWorkStatus (Form Component)
Component Select để chọn trạng thái làm việc, có group options.

**Location:** `src/components/common/form/SelectWorkStatus.tsx`

**Usage:**
```tsx
import SelectWorkStatus from "@/components/common/form/SelectWorkStatus";

// In Form
<Form.Item name="workStatus" label="Trạng thái">
  <SelectWorkStatus />
</Form.Item>

// With value and onChange
<SelectWorkStatus 
  value={workStatus}
  onChange={(value) => setWorkStatus(value)}
/>
```

**Props:** Inherits all Ant Design Select props

## WorkStatus Types

```typescript
type WorkStatus =
  // Đang làm việc
  | "WORKING_ONSITE"      // Đang làm việc tại văn phòng
  | "WORK_FROM_HOME"      // Làm việc từ xa
  | "BUSINESS_TRIP"       // Đi công tác
  | "TRAINING"            // Đang đào tạo
  
  // Nghỉ phép
  | "ON_LEAVE_PERSONAL"   // Nghỉ phép cá nhân
  | "ON_LEAVE_SICK"       // Nghỉ ốm
  | "ON_LEAVE_MATERNITY"  // Nghỉ thai sản
  | "ON_LEAVE_VACATION"   // Nghỉ phép năm
  
  // Khác
  | "OFF_DUTY"            // Nghỉ không lương
  | "ABSENT"              // Vắng mặt
  
  // Đã nghỉ việc
  | "RESIGNED"            // Đã nghỉ việc
  | "TERMINATED"          // Bị sa thải
  | "RETIRED"             // Nghỉ hưu
```

## Status Colors

| Status | Color | Label |
|--------|-------|-------|
| WORKING_ONSITE | green | Đang làm việc |
| WORK_FROM_HOME | blue | Làm từ xa |
| BUSINESS_TRIP | cyan | Công tác |
| TRAINING | purple | Đào tạo |
| ON_LEAVE_PERSONAL | orange | Nghỉ phép |
| ON_LEAVE_SICK | red | Nghỉ ốm |
| ON_LEAVE_MATERNITY | pink | Nghỉ thai sản |
| ON_LEAVE_VACATION | lime | Nghỉ phép năm |
| OFF_DUTY | default | Nghỉ không lương |
| ABSENT | volcano | Vắng mặt |
| RESIGNED | default | Đã nghỉ việc |
| TERMINATED | error | Bị sa thải |
| RETIRED | gold | Nghỉ hưu |

## Example in DataTable

```tsx
import { WorkStatus } from "@/components/common/status";

const columns = [
  {
    title: "Trạng thái",
    dataIndex: "workStatus",
    key: "workStatus",
    render: (status: WorkStatusType) => <WorkStatus status={status} />,
  },
];
```

