import type { WorkStatus as WorkStatusType } from "@/apis/employee/model/Employee";

export const WORK_STATUS_OPTIONS: {
  value: WorkStatusType;
  label: string;
  group?: string;
}[] = [
  // Đang làm việc
  {
    value: "WORKING_ONSITE",
    label: "Đang làm việc tại văn phòng",
    group: "Đang làm việc",
  },
  {
    value: "WORK_FROM_HOME",
    label: "Làm việc từ xa",
    group: "Đang làm việc",
  },
  {
    value: "BUSINESS_TRIP",
    label: "Đi công tác",
    group: "Đang làm việc",
  },
  {
    value: "TRAINING",
    label: "Đang đào tạo",
    group: "Đang làm việc",
  },

  // Nghỉ phép
  {
    value: "ON_LEAVE_PERSONAL",
    label: "Nghỉ phép cá nhân",
    group: "Nghỉ phép",
  },
  {
    value: "ON_LEAVE_SICK",
    label: "Nghỉ ốm",
    group: "Nghỉ phép",
  },
  {
    value: "ON_LEAVE_MATERNITY",
    label: "Nghỉ thai sản",
    group: "Nghỉ phép",
  },
  {
    value: "ON_LEAVE_VACATION",
    label: "Nghỉ phép năm",
    group: "Nghỉ phép",
  },

  // Trạng thái khác
  {
    value: "OFF_DUTY",
    label: "Nghỉ không lương",
    group: "Khác",
  },
  {
    value: "ABSENT",
    label: "Vắng mặt",
    group: "Khác",
  },

  // Đã nghỉ việc
  {
    value: "RESIGNED",
    label: "Đã nghỉ việc",
    group: "Đã nghỉ việc",
  },
  {
    value: "TERMINATED",
    label: "Bị sa thải",
    group: "Đã nghỉ việc",
  },
  {
    value: "RETIRED",
    label: "Nghỉ hưu",
    group: "Đã nghỉ việc",
  },
];
