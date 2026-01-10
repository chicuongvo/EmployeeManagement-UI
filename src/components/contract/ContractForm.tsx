import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileText, X } from "lucide-react";
import type {
  ContractResponse,
  CreateContractRequest,
  UpdateContractRequest,
  ContractType,
  ContractStatus,
} from "@/types/Contract";

interface ContractFormProps {
  initialData?: ContractResponse | null;
  onSubmit: (data: CreateContractRequest | UpdateContractRequest | FormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export function ContractForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = "create",
}: ContractFormProps) {
  const [formData, setFormData] = React.useState({
    contractCode: initialData?.contractCode || "",
    type: (initialData?.type || "FULL_TIME") as ContractType,
    startDate: initialData?.startDate ? initialData.startDate.split("T")[0] : "",
    endDate: initialData?.endDate ? initialData.endDate.split("T")[0] : "",
    signedDate: initialData?.signedDate ? initialData.signedDate.split("T")[0] : "",
    status: (initialData?.status || "DRAFT") as ContractStatus,
    dailySalary: initialData?.dailySalary?.toString() || "",
    allowance: initialData?.allowance?.toString() || "",
    note: initialData?.note || "",
    employeeId: initialData?.employeeId?.toString() || "",
  });

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    initialData?.attachment || null
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Preview cho ảnh
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(initialData?.attachment || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (mode === "create") {
      if (!formData.employeeId) {
        alert("Vui lòng nhập ID nhân viên");
        return;
      }
    }

    // Nếu có file, dùng FormData
    if (selectedFile) {
      const formDataToSend = new FormData();
      formDataToSend.append("attachment", selectedFile);
      // Gửi contractCode nếu có (cả create và edit)
      if (formData.contractCode && formData.contractCode.trim()) {
        formDataToSend.append("contractCode", formData.contractCode);
      }
      formDataToSend.append("type", formData.type);
      formDataToSend.append("startDate", formData.startDate);
      formDataToSend.append("endDate", formData.endDate);
      formDataToSend.append("signedDate", formData.signedDate);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("dailySalary", formData.dailySalary);
      formDataToSend.append("allowance", formData.allowance);
      if (formData.note) formDataToSend.append("note", formData.note);
      if (formData.employeeId) formDataToSend.append("employeeId", formData.employeeId);

      await onSubmit(formDataToSend);
    } else {
      // Không có file, gửi JSON
      const data: CreateContractRequest | UpdateContractRequest = {
        // Gửi contractCode nếu có (cả create và edit)
        ...(formData.contractCode && formData.contractCode.trim()
          ? { contractCode: formData.contractCode }
          : {}),
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        signedDate: formData.signedDate,
        status: formData.status,
        dailySalary: parseFloat(formData.dailySalary) || 0,
        allowance: parseFloat(formData.allowance) || 0,
        note: formData.note || undefined,
        ...(mode === "create"
          ? {
              employeeId: parseInt(formData.employeeId),
            }
          : {}),
      };
      await onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contractCode">
            Mã hợp đồng {mode === "create" && "(Để trống để tự động tạo)"}
          </Label>
          <Input
            id="contractCode"
            value={formData.contractCode}
            onChange={(e) =>
              setFormData({ ...formData, contractCode: e.target.value })
            }
            placeholder="CT001"
            disabled={isLoading || mode === "edit"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Loại hợp đồng *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData({ ...formData, type: value as ContractType })
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FULL_TIME">Toàn thời gian</SelectItem>
              <SelectItem value="PART_TIME">Bán thời gian</SelectItem>
              <SelectItem value="INTERNSHIP">Thực tập</SelectItem>
              <SelectItem value="PROBATION">Thử việc</SelectItem>
              <SelectItem value="TEMPORARY">Tạm thời</SelectItem>
              <SelectItem value="FREELANCE">Freelance</SelectItem>
              <SelectItem value="OUTSOURCE">Outsource</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Ngày bắt đầu *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Ngày kết thúc *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signedDate">Ngày ký *</Label>
          <Input
            id="signedDate"
            type="date"
            value={formData.signedDate}
            onChange={(e) =>
              setFormData({ ...formData, signedDate: e.target.value })
            }
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dailySalary">Lương ngày *</Label>
          <Input
            id="dailySalary"
            type="number"
            step="0.01"
            value={formData.dailySalary}
            onChange={(e) =>
              setFormData({ ...formData, dailySalary: e.target.value })
            }
            placeholder="0.00"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="allowance">Phụ cấp *</Label>
          <Input
            id="allowance"
            type="number"
            step="0.01"
            value={formData.allowance}
            onChange={(e) =>
              setFormData({ ...formData, allowance: e.target.value })
            }
            placeholder="0.00"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {mode === "create" && (
        <div className="space-y-2">
          <Label htmlFor="employeeId">ID Nhân viên *</Label>
          <Input
            id="employeeId"
            type="number"
            value={formData.employeeId}
            onChange={(e) =>
              setFormData({ ...formData, employeeId: e.target.value })
            }
            placeholder="1"
            required
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground">
            Người ký sẽ là tài khoản hiện tại của bạn.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="status">Trạng thái</Label>
        <Select
          value={formData.status}
          onValueChange={(value) =>
            setFormData({ ...formData, status: value as ContractStatus })
          }
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">Nháp</SelectItem>
            <SelectItem value="PENDING">Chờ duyệt</SelectItem>
            <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
            <SelectItem value="EXPIRED">Hết hạn</SelectItem>
            <SelectItem value="TERMINATED">Chấm dứt</SelectItem>
            <SelectItem value="RENEWED">Gia hạn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Ghi chú</Label>
        <Textarea
          id="note"
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          placeholder="Ghi chú về hợp đồng..."
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="attachment">File đính kèm (Ảnh/PDF)</Label>
        <div className="flex items-center gap-4">
          <Input
            ref={fileInputRef}
            id="attachment"
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            disabled={isLoading}
            className="cursor-pointer"
          />
          {previewUrl && (
            <div className="relative">
              {previewUrl.includes("http") || previewUrl.startsWith("data:") ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded border"
                />
              ) : (
                <div className="h-20 w-20 flex items-center justify-center border rounded bg-muted">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={handleRemoveFile}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Hỗ trợ ảnh (JPG, PNG, GIF, WEBP) và PDF. Tối đa 10MB.
        </p>
      </div>

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
            ? "Tạo hợp đồng"
            : "Cập nhật"}
        </Button>
      </div>
    </form>
  );
}

