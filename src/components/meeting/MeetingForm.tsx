import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import SelectListEmployee from "@/components/common/form/SelectListEmployee";
import type { MeetingResponse, CreateMeetingRequest } from "@/types/Meeting";
import { message } from "antd";

interface MeetingFormProps {
  initialData?: MeetingResponse | null;
  onSubmit: (data: CreateMeetingRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
  hideSubmitButton?: boolean;
  onFormDataChange?: (formData: {
    title: string;
    scheduledAt: any;
    participantIds: number[];
  }) => void;
}

export function MeetingForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = "create",
  hideSubmitButton = false,
  onFormDataChange,
}: MeetingFormProps) {
  const [formData, setFormData] = React.useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    scheduledAt: initialData?.scheduledAt
      ? dayjs(initialData.scheduledAt)
      : null,
    participantIds: [] as number[],
  });

  // Notify parent component when form data changes
  React.useEffect(() => {
    onFormDataChange?.({
      title: formData.title,
      scheduledAt: formData.scheduledAt,
      participantIds: formData.participantIds,
    });
  }, [formData, onFormDataChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.title.trim()) {
      message.error("Vui lòng nhập tên cuộc họp");
      return;
    }

    if (!formData.scheduledAt) {
      message.error("Vui lòng chọn thời gian bắt đầu");
      return;
    }

    const submitData: CreateMeetingRequest = {
      title: formData.title.trim(),
      description: formData.description?.trim() || undefined,
      scheduledAt: formData.scheduledAt.toISOString(),
      participantIds: formData.participantIds.length > 0 ? formData.participantIds : undefined,
    };

    await onSubmit(submitData);
  };

  return (
    <form id="meeting-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Tên cuộc họp *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          placeholder="Nhập tên cuộc họp"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="scheduledAt">Thời gian bắt đầu *</Label>
        <DatePicker
          id="scheduledAt"
          showTime
          format="DD/MM/YYYY HH:mm"
          value={formData.scheduledAt}
          onChange={(date) => setFormData({ ...formData, scheduledAt: date })}
          placeholder="Chọn thời gian bắt đầu"
          style={{ width: "100%" }}
          disabled={isLoading}
          disabledDate={(current) => current && current < dayjs().startOf("day")}
        />
      </div>

      <div className="space-y-2 w-full">
        <Label htmlFor="participantIds" className="text-base">Người tham gia</Label>
        <SelectListEmployee
          mode="multiple"
          placeholder="Chọn người tham gia (có thể chọn nhiều)"
          value={formData.participantIds}
          onChange={(values) =>
            setFormData({
              ...formData,
              participantIds: (values || []) as number[],
            })
          }
          allowClear
          disabled={isLoading}
          className="w-full"
          //style={{ minHeight: '48px' }}
          // size="large"
          // maxTagCount="responsive"

        />
        <p className="text-sm text-muted-foreground">
          Chọn các nhân viên được phép tham gia cuộc họp. Để trống nếu cho phép tất cả.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả / Agenda</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Nhập mô tả hoặc agenda cho cuộc họp (có thể xuống dòng)"
          rows={12}
          disabled={isLoading}
          className="min-h-[300px] text-base"
        />
        <p className="text-sm text-muted-foreground">
          Nhập các điểm cần thảo luận trong cuộc họp (mỗi điểm một dòng)
        </p>
      </div>

      {!hideSubmitButton && (
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Đang xử lý..." : mode === "create" ? "Tạo cuộc họp" : "Cập nhật"}
          </button>
        </div>
      )}
    </form>
  );
}
