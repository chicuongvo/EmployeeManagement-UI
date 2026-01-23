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
  onSubmit: (
    data: CreateUpdateRequestRequest | UpdateUpdateRequestRequest,
  ) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
  isEditable?: boolean;
  hideSubmitButton?: boolean;
  onFormDataChange?: (formData: {
    content: string;
    requestedById: number;
  }) => void;
  lockRequestedBy?: boolean;
  requestedByDisplay?: { id: number; fullName?: string; email?: string } | null;
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
  lockRequestedBy = false,
  requestedByDisplay = null,
}: UpdateRequestFormProps) {
  const [formData, setFormData] = React.useState({
    content: initialData?.content || "",
    requestedById: initialData?.requestedById || 0,
  });

  // Notify parent component when form data changes
  React.useEffect(() => {
    onFormDataChange?.(formData);
  }, [formData, onFormDataChange]);

  // Khi form ở chế độ tạo từ "Đơn yêu cầu của tôi", tự set requestedById = user hiện tại
  React.useEffect(() => {
    if (
      mode === "create" &&
      lockRequestedBy &&
      requestedByDisplay?.id &&
      formData.requestedById === 0
    ) {
      setFormData((prev) => ({
        ...prev,
        requestedById: requestedByDisplay.id,
      }));
    }
  }, [mode, lockRequestedBy, requestedByDisplay?.id, formData.requestedById]);

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
    <form
      id="update-request-form"
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      {mode === "create" ? (
        <div className="space-y-3">
          <Label
            htmlFor="requestedById"
            className="text-sm font-semibold text-gray-800 flex items-center gap-1"
          >
            Người yêu cầu
            <span className="text-red-500">*</span>
          </Label>
          {lockRequestedBy && requestedByDisplay?.id ? (
            <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
              <div className="font-medium text-gray-800">
                {requestedByDisplay.fullName || "Bạn"}
              </div>
              {requestedByDisplay.email && (
                <div className="text-sm text-gray-600 mt-1">
                  {requestedByDisplay.email}
                </div>
              )}
            </div>
          ) : (
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
              style={{
                minHeight: "48px",
                borderRadius: "8px",
                borderColor: "#e5e7eb",
                backgroundColor: "#ffffff",
                fontSize: "14px",
              }}
              className="shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              size="large"
              defaultValue={
                initialData?.requestedById
                  ? [
                      {
                        id: initialData.requestedById,
                        name: initialData.requestedBy?.fullName || "",
                      },
                    ]
                  : []
              }
            />
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <Label
            htmlFor="requestedById"
            className="text-sm font-semibold text-gray-800"
          >
            Người yêu cầu
          </Label>
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
              defaultValue={
                initialData?.requestedById
                  ? [
                      {
                        id: initialData.requestedById,
                        name: initialData.requestedBy?.fullName || "",
                      },
                    ]
                  : []
              }
            />
          ) : (
            <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
              <div className="font-medium text-gray-800">
                {initialData?.requestedBy?.fullName || "-"}
              </div>
              {initialData?.requestedBy?.email && (
                <div className="text-sm text-gray-600 mt-1">
                  {initialData.requestedBy.email}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        <Label
          htmlFor="content"
          className="text-sm font-semibold text-gray-800 flex items-center gap-1"
        >
          Nội dung đơn xin
          <span className="text-red-500">*</span>
        </Label>
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
          className="min-h-[200px] border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg shadow-sm resize-none transition-all duration-200 text-gray-700 placeholder-gray-400"
        />
        <p className="text-sm text-gray-500 italic">
          Mô tả chi tiết yêu cầu thay đổi của bạn
        </p>
      </div>

      {mode !== "create" && initialData?.oldValue && (
        <div className="space-y-2">
          <Label
            htmlFor="oldValue"
            className="text-sm font-semibold text-gray-800"
          >
            Giá trị cũ
          </Label>
          <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
            {initialData.oldValue || "-"}
          </div>
        </div>
      )}

      {mode !== "create" && initialData?.newValue && (
        <div className="space-y-2">
          <Label
            htmlFor="newValue"
            className="text-sm font-semibold text-gray-800"
          >
            Giá trị mới
          </Label>
          <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
            {initialData.newValue || "-"}
          </div>
        </div>
      )}

      {mode !== "create" && initialData?.status && (
        <div className="space-y-2">
          <Label
            htmlFor="status"
            className="text-sm font-semibold text-gray-800"
          >
            Trạng thái
          </Label>
          <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
            {initialData.status === "PENDING" && "Chờ duyệt"}
            {initialData.status === "APPROVED" && "Đã duyệt"}
            {initialData.status === "NOT_APPROVED" && "Từ chối"}
          </div>
        </div>
      )}

      {mode !== "create" && initialData?.reviewedBy && (
        <div className="space-y-2">
          <Label
            htmlFor="reviewedBy"
            className="text-sm font-semibold text-gray-800"
          >
            Người duyệt
          </Label>
          <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
            <div className="font-medium text-gray-800">
              {initialData.reviewedBy.fullName || "-"}
            </div>
            {initialData.reviewedBy.email && (
              <div className="text-sm text-gray-600 mt-1">
                {initialData.reviewedBy.email}
              </div>
            )}
          </div>
        </div>
      )}

      {mode !== "create" && (
        <>
          <div className="space-y-2">
            <Label
              htmlFor="createdAt"
              className="text-sm font-semibold text-gray-800"
            >
              Ngày tạo
            </Label>
            <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
              {(() => {
                const createdAt =
                  initialData?.createdAt || (initialData as any)?.created_at;
                return createdAt
                  ? dayjs(createdAt as string).format("DD/MM/YYYY HH:mm:ss")
                  : "-";
              })()}
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="updatedAt"
              className="text-sm font-semibold text-gray-800"
            >
              Ngày cập nhật
            </Label>
            <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
              {(() => {
                const updatedAt =
                  initialData?.updatedAt || (initialData as any)?.updated_at;
                return updatedAt
                  ? dayjs(updatedAt as string).format("DD/MM/YYYY HH:mm:ss")
                  : "-";
              })()}
            </div>
          </div>
        </>
      )}

      {!hideSubmitButton && (
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
          >
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
