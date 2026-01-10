import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
}

export function UpdateRequestForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = "create",
}: UpdateRequestFormProps) {
  const [formData, setFormData] = React.useState({
    content: initialData?.content || "",
    requestedById: initialData?.requestedById || 0,
  });

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
    <form onSubmit={handleSubmit} className="space-y-4">
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
          disabled={isLoading}
          className="min-h-[200px]"
        />
        <p className="text-sm text-muted-foreground">
          Mô tả chi tiết yêu cầu thay đổi của bạn
        </p>
      </div>

      {mode === "create" && (
        <div className="space-y-2">
          <Label htmlFor="requestedById">ID Người yêu cầu *</Label>
          <Input
            id="requestedById"
            type="number"
            value={formData.requestedById || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                requestedById: parseInt(e.target.value) || 0,
              })
            }
            placeholder="Nhập ID người yêu cầu"
            required
            disabled={isLoading}
          />
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
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
    </form>
  );
}

