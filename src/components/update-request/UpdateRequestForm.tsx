import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SelectListEmployee from "@/components/common/form/SelectListEmployee";
import dayjs from "dayjs";
import type {
  UpdateRequestResponse,
  CreateUpdateRequestRequest,
  UpdateUpdateRequestRequest,
} from "@/types/UpdateRequest";

interface UpdateRequestFormProps {
  initialData?: UpdateRequestResponse | null;
  onSubmit: (data: CreateUpdateRequestRequest | UpdateUpdateRequestRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
  isEditable?: boolean;
  hideSubmitButton?: boolean;
  onFormDataChange?: (formData: { content: string; requestedById: number }) => void;
}

export function UpdateRequestForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = "create",
  isEditable = true,
  hideSubmitButton = false,
  onFormDataChange,
}: UpdateRequestFormProps) {
  const [formData, setFormData] = React.useState({
    content: initialData?.content || "",
    requestedById: initialData?.requestedById || 0,
  });

  // Notify parent component when form data changes
  React.useEffect(() => {
    onFormDataChange?.(formData);
  }, [formData, onFormDataChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "create") {
      if (formData.requestedById === 0) {
        alert("Vui lòng nhập ID người yêu cầu");
        return;
      }
      if (!formData.content.trim()) {
        alert("Vui lòng nhập nội dung đơn xin");
        return;
      }
      const createData: CreateUpdateRequestRequest = {
        content: formData.content,
        requestedById: formData.requestedById,
      };
      await onSubmit(createData);
    } else {
      if (!formData.content.trim()) {
        alert("Vui lòng nhập nội dung đơn xin");
        return;
      }
      const updateData: UpdateUpdateRequestRequest = {
        content: formData.content,
      };
      await onSubmit(updateData);
    }
  };

  return (
    <form id="update-request-form" onSubmit={handleSubmit} className="space-y-4">
      {mode === "create" ? (
        <div className="space-y-2">
          <Label htmlFor="requestedById">Người yêu cầu *</Label>
          <SelectListEmployee
            placeholder="Chọn người yêu cầu"
            value={formData.requestedById || undefined}
            onChange={(value) =>
              setFormData({
                ...formData,
                requestedById: value || 0,
              })
            }
            allowClear={false}
            disabled={isLoading || !isEditable}
            defaultValue={initialData?.requestedById ? [{ id: initialData.requestedById, name: initialData.requestedBy?.fullName || "" }] : []}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="requestedById">Người yêu cầu</Label>
          {isEditable ? (
            <SelectListEmployee
              placeholder="Chọn người yêu cầu"
              value={formData.requestedById || undefined}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  requestedById: value || 0,
                })
              }
              allowClear={false}
              disabled={true}
              defaultValue={initialData?.requestedById ? [{ id: initialData.requestedById, name: initialData.requestedBy?.fullName || "" }] : []}
            />
          ) : (
            <div className="px-3 py-2 border rounded-md bg-gray-50">
              <div>{initialData?.requestedBy?.fullName || "-"}</div>
              {initialData?.requestedBy?.email && (
                <div className="text-sm text-gray-500">{initialData.requestedBy.email}</div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="content">Nội dung đơn xin *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder="Nhập nội dung đơn xin thay đổi..."
          rows={8}
          required
          disabled={isLoading || !isEditable}
          className="min-h-[200px]"
        />
        <p className="text-sm text-muted-foreground">
          Mô tả chi tiết yêu cầu thay đổi của bạn
        </p>
      </div>

      {mode !== "create" && initialData?.oldValue && (
        <div className="space-y-2">
          <Label htmlFor="oldValue">Giá trị cũ</Label>
          <div className="px-3 py-2 border rounded-md bg-gray-50">
            {initialData.oldValue || "-"}
          </div>
        </div>
      )}

      {mode !== "create" && initialData?.newValue && (
        <div className="space-y-2">
          <Label htmlFor="newValue">Giá trị mới</Label>
          <div className="px-3 py-2 border rounded-md bg-gray-50">
            {initialData.newValue || "-"}
          </div>
        </div>
      )}

      {mode !== "create" && initialData?.status && (
        <div className="space-y-2">
          <Label htmlFor="status">Trạng thái</Label>
          <div className="px-3 py-2 border rounded-md bg-gray-50">
            {initialData.status === "PENDING" && "Chờ duyệt"}
            {initialData.status === "APPROVED" && "Đã duyệt"}
            {initialData.status === "NOT_APPROVED" && "Từ chối"}
          </div>
        </div>
      )}

      {mode !== "create" && initialData?.reviewedBy && (
        <div className="space-y-2">
          <Label htmlFor="reviewedBy">Người duyệt</Label>
          <div className="px-3 py-2 border rounded-md bg-gray-50">
            <div>{initialData.reviewedBy.fullName || "-"}</div>
            {initialData.reviewedBy.email && (
              <div className="text-sm text-gray-500">{initialData.reviewedBy.email}</div>
            )}
          </div>
        </div>
      )}

      {mode !== "create" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="createdAt">Ngày tạo</Label>
            <div className="px-3 py-2 border rounded-md bg-gray-50">
              {(() => {
                const createdAt = initialData?.createdAt || (initialData as any)?.created_at;
                return createdAt ? dayjs(createdAt as string).format("DD/MM/YYYY HH:mm:ss") : "-";
              })()}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="updatedAt">Ngày cập nhật</Label>
            <div className="px-3 py-2 border rounded-md bg-gray-50">
              {(() => {
                const updatedAt = initialData?.updatedAt || (initialData as any)?.updated_at;
                return updatedAt ? dayjs(updatedAt as string).format("DD/MM/YYYY HH:mm:ss") : "-";
              })()}
            </div>
          </div>
        </>
      )}

      {!hideSubmitButton && (
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Đang xử lý..."
              : mode === "create"
              ? "Gửi đơn xin"
              : "Cập nhật"}
          </Button>
        </div>
      )}
    </form>
  );
}

