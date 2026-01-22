import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload as AntUpload, Card, Alert, message, Space } from "antd";
import SelectListEmployee from "@/components/common/form/SelectListEmployee";
import SelectListContractType from "@/components/common/form/SelectListContractType";
import SelectListContractStatus from "@/components/common/form/SelectListContractStatus";
import {
  InboxOutlined,
  FileTextOutlined,
  FileImageOutlined,
  DeleteOutlined,
  LoadingOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd/es/upload/interface";
import type {
  ContractResponse,
  CreateContractRequest,
  UpdateContractRequest,
  ContractType,
  ContractStatus,
} from "@/types/Contract";
import { extractContractFromPDF } from "@/api/contract.api";
import dayjs from "dayjs";

interface ContractFormProps {
  initialData?: ContractResponse | null;
  onSubmit: (
    data: CreateContractRequest | UpdateContractRequest | FormData
  ) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
  isEditable?: boolean;
  hideSubmitButton?: boolean;
  onFormDataChange?: (formData: {
    contractCode: string;
    type: ContractType;
    startDate: string;
    endDate: string;
    signedDate: string;
    status: ContractStatus;
    dailySalary: string;
    allowance: string;
    note: string;
    employeeId: string;
    signedById: string;
  }) => void;
}

export function ContractForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = "create",
  isEditable = true,
  hideSubmitButton = false,
  onFormDataChange,
}: ContractFormProps) {
  const [formData, setFormData] = React.useState({
    contractCode: initialData?.contractCode || "",
    type: (initialData?.type || "FULL_TIME") as ContractType,
    startDate: initialData?.startDate
      ? initialData.startDate.split("T")[0]
      : "",
    endDate: initialData?.endDate ? initialData.endDate.split("T")[0] : "",
    signedDate: initialData?.signedDate
      ? initialData.signedDate.split("T")[0]
      : "",
    status: (initialData?.status || "DRAFT") as ContractStatus,
    dailySalary: initialData?.dailySalary?.toString() || "",
    allowance: initialData?.allowance?.toString() || "",
    note: initialData?.note || "",
    employeeId: initialData?.employeeId?.toString() || "",
    signedById: initialData?.signedById?.toString() || "",
  });

  // Notify parent component when form data changes
  React.useEffect(() => {
    onFormDataChange?.(formData);
  }, [formData, onFormDataChange]);

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    initialData?.attachment || null
  );
  const [fileList, setFileList] = React.useState<UploadFile[]>(
    initialData?.attachment
      ? [
          {
            uid: "-1",
            name: initialData.attachment.match(/\.pdf$/i)
              ? "Hợp đồng.pdf"
              : initialData.attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i)
              ? "Hợp đồng.jpg"
              : "File đính kèm",
            status: "done",
            url: initialData.attachment,
          },
        ]
      : []
  );
  const [pdfFileList, setPdfFileList] = React.useState<UploadFile[]>([]);
  const [isExtractingPDF, setIsExtractingPDF] = React.useState(false);

  // Handle regular file upload (for attachment)
  const handleFileUpload: UploadProps["onChange"] = (info) => {
    const { fileList: newFileList, file } = info;
    setFileList(newFileList);

    console.log("handleFileUpload - file:", file);
    console.log("handleFileUpload - file.status:", file.status);
    console.log("handleFileUpload - file.originFileObj:", file.originFileObj);

    // Với beforeUpload: false, file sẽ không có status "done"
    // Nên chúng ta check originFileObj trực tiếp
    if (
      file.originFileObj ||
      (file.status !== "removed" && file.status !== "error")
    ) {
      const uploadedFile = file.originFileObj || (file as any);
      console.log("handleFileUpload - Setting selectedFile:", uploadedFile);
      setSelectedFile(uploadedFile);

      // Preview for images
      if (uploadedFile?.type?.startsWith("image/")) {
        const url = URL.createObjectURL(uploadedFile);
        setPreviewUrl(url);
      } else if (uploadedFile?.type === "application/pdf") {
        setPreviewUrl(null);
      }
    }

    if (file.status === "removed") {
      setSelectedFile(null);
      setPreviewUrl(initialData?.attachment || null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(initialData?.attachment || null);
    setFileList([]);
  };

  // Handle PDF upload for AI extraction
  const handlePDFUpload: UploadProps["onChange"] = async (info) => {
    const { fileList: newFileList, file } = info;
    setPdfFileList(newFileList);

    if (file.status === "uploading" || file.status === "done") {
      const uploadedFile = file.originFileObj || (file as any);

      // Check if file is PDF
      if (uploadedFile?.type !== "application/pdf") {
        message.error("Vui lòng chọn file PDF");
        setPdfFileList([]);
        return;
      }

      setIsExtractingPDF(true);
      try {
        // Call API to extract contract info
        const extractedInfo = await extractContractFromPDF(uploadedFile);

        // Auto-fill form with extracted data
        setFormData((prev) => ({
          ...prev,
          contractCode: extractedInfo.contractCode || prev.contractCode,
          type: (extractedInfo.type || prev.type) as ContractType,
          startDate: extractedInfo.startDate || prev.startDate,
          endDate: extractedInfo.endDate || prev.endDate,
          signedDate: extractedInfo.signedDate || prev.signedDate,
          dailySalary: extractedInfo.dailySalary
            ? extractedInfo.dailySalary.toString()
            : prev.dailySalary,
          allowance: extractedInfo.allowance
            ? extractedInfo.allowance.toString()
            : prev.allowance,
          note: extractedInfo.note || prev.note,
          ...(extractedInfo.employeeId && mode === "create"
            ? { employeeId: extractedInfo.employeeId.toString() }
            : {}),
        }));

        // Also set the PDF as selected file for attachment
        setSelectedFile(uploadedFile);
        setFileList([
          {
            uid: uploadedFile.name,
            name: uploadedFile.name,
            status: "done",
            originFileObj: uploadedFile,
          },
        ]);

        // Show success message with extracted info
        let successMsg = "Đã trích xuất thông tin từ PDF thành công!";
        if (extractedInfo.employeeName) {
          successMsg += `\nNhân viên: ${extractedInfo.employeeName}`;
        }
        if (extractedInfo.contractCode) {
          successMsg += `\nMã hợp đồng: ${extractedInfo.contractCode}`;
        }
        message.success(successMsg);
        message.info("Vui lòng kiểm tra và điều chỉnh thông tin nếu cần.");

        // Update file status
        setPdfFileList([
          {
            uid: uploadedFile.name,
            name: uploadedFile.name,
            status: "done",
            originFileObj: uploadedFile,
          },
        ]);
      } catch (error: any) {
        console.error("Error extracting PDF:", error);
        message.error(
          `Lỗi khi đọc PDF: ${
            error.response?.data?.message || error.message || "Vui lòng thử lại"
          }`
        );
        setPdfFileList([]);
      } finally {
        setIsExtractingPDF(false);
      }
    }

    if (file.status === "removed") {
      setPdfFileList([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (mode === "create") {
      if (!formData.employeeId) {
        message.error("Vui lòng chọn nhân viên");
        return;
      }
    }
    if (!formData.signedById) {
      message.error("Vui lòng chọn người ký");
      return;
    }

    // Luôn dùng FormData để tương thích với multer middleware
    const formDataToSend = new FormData();

    // Debug log
    console.log("ContractForm - selectedFile:", selectedFile);
    console.log("ContractForm - selectedFile type:", selectedFile?.type);
    console.log("ContractForm - selectedFile name:", selectedFile?.name);

    // Thêm file nếu có
    if (selectedFile) {
      formDataToSend.append("attachment", selectedFile);
      console.log("ContractForm - File added to FormData");
    } else {
      console.log("ContractForm - No file to add");
    }

    // Thêm các field khác
    formDataToSend.append("type", formData.type);
    formDataToSend.append("startDate", formData.startDate);
    formDataToSend.append("endDate", formData.endDate);
    formDataToSend.append("signedDate", formData.signedDate);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("dailySalary", formData.dailySalary);
    formDataToSend.append("allowance", formData.allowance);
    if (formData.note) formDataToSend.append("note", formData.note);
    if (formData.employeeId)
      formDataToSend.append("employeeId", formData.employeeId);
    if (formData.signedById)
      formDataToSend.append("signedById", formData.signedById);

    await onSubmit(formDataToSend);
  };

  const uploadProps: UploadProps = {
    accept: "application/pdf",
    maxCount: 1,
    fileList: pdfFileList,
    onChange: handlePDFUpload,
    beforeUpload: () => false, // Prevent auto upload
    disabled: isLoading || isExtractingPDF || !isEditable,
  };

  const attachmentUploadProps: UploadProps = {
    accept: "image/*,.pdf",
    maxCount: 1,
    fileList: fileList,
    onChange: handleFileUpload,
    beforeUpload: () => false, // Prevent auto upload
    disabled: isLoading || !isEditable,
  };

  return (
    <form id="contract-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Loại hợp đồng *</Label>
          <SelectListContractType
            placeholder="Chọn loại hợp đồng"
            value={formData.type}
            onChange={(value) =>
              setFormData({
                ...formData,
                type: (value || "FULL_TIME") as ContractType,
              })
            }
            disabled={isLoading || !isEditable}
            allowClear={false}
          />
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
            disabled={isLoading || !isEditable}
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
            disabled={isLoading || !isEditable}
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
            disabled={isLoading || !isEditable}
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
            disabled={isLoading || !isEditable}
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
            disabled={isLoading || !isEditable}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {mode === "create" ? (
          <div className="space-y-2">
            <Label htmlFor="employeeId">Nhân viên *</Label>
            <SelectListEmployee
              placeholder="Chọn nhân viên"
              value={
                formData.employeeId ? Number(formData.employeeId) : undefined
              }
              onChange={(value) =>
                setFormData({
                  ...formData,
                  employeeId: value ? value.toString() : "",
                })
              }
              allowClear={false}
              disabled={isLoading || !isEditable}
              defaultValue={
                initialData?.employeeId
                  ? [
                      {
                        id: initialData.employeeId,
                        name: initialData.employee?.fullName || "",
                      },
                    ]
                  : []
              }
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="employeeId">Nhân viên</Label>
            {isEditable ? (
              <SelectListEmployee
                placeholder="Chọn nhân viên"
                value={
                  formData.employeeId ? Number(formData.employeeId) : undefined
                }
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    employeeId: value ? value.toString() : "",
                  })
                }
                allowClear={false}
                disabled={true}
                defaultValue={
                  initialData?.employeeId
                    ? [
                        {
                          id: initialData.employeeId,
                          name: initialData.employee?.fullName || "",
                        },
                      ]
                    : []
                }
              />
            ) : (
              <div className="px-3 py-2 border rounded-md bg-gray-50">
                <div>{initialData?.employee?.fullName || "-"}</div>
                {initialData?.employee?.email && (
                  <div className="text-sm text-gray-500">
                    {initialData.employee.email}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="signedById">Người ký *</Label>
          <SelectListEmployee
            placeholder="Chọn người ký"
            value={
              formData.signedById ? Number(formData.signedById) : undefined
            }
            onChange={(value) =>
              setFormData({
                ...formData,
                signedById: value ? value.toString() : "",
              })
            }
            allowClear={false}
            disabled={isLoading || !isEditable}
            defaultValue={
              initialData?.signedById
                ? [
                    {
                      id: initialData.signedById,
                      name: initialData.signedBy?.fullName || "",
                    },
                  ]
                : []
            }
          />
        </div>
      </div>

      {mode !== "create" && (
        <>
          {initialData?.contractCode && (
            <div className="space-y-2">
              <Label htmlFor="contractCode">Mã hợp đồng</Label>
              <div className="px-3 py-2 border rounded-md bg-gray-50">
                {initialData.contractCode}
              </div>
            </div>
          )}
          {initialData?.createdAt && (
            <div className="space-y-2">
              <Label htmlFor="createdAt">Ngày tạo</Label>
              <div className="px-3 py-2 border rounded-md bg-gray-50">
                {dayjs(initialData.createdAt).format("DD/MM/YYYY HH:mm:ss")}
              </div>
            </div>
          )}
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="status">Trạng thái</Label>
        <SelectListContractStatus
          placeholder="Chọn trạng thái"
          value={formData.status}
          onChange={(value) =>
            setFormData({
              ...formData,
              status: (value || "DRAFT") as ContractStatus,
            })
          }
          disabled={isLoading || !isEditable}
          allowClear={false}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Ghi chú</Label>
        <Textarea
          id="note"
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          placeholder="Ghi chú về hợp đồng..."
          rows={3}
          disabled={isLoading || !isEditable}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="attachment">File đính kèm (Ảnh/PDF)</Label>
        <AntUpload.Dragger {...attachmentUploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined className="text-2xl text-gray-400" />
          </p>
          <p className="ant-upload-text">
            Click hoặc kéo thả file vào đây để upload
          </p>
          <p className="ant-upload-hint">
            Hỗ trợ ảnh (JPG, PNG, GIF, WEBP) và PDF. Tối đa 10MB.
          </p>
        </AntUpload.Dragger>
        {(previewUrl || fileList.length > 0) && (
          <Card size="small" className="mt-2">
            <div className="flex items-center gap-3">
              {(() => {
                const url = previewUrl || fileList[0]?.url;
                const isImage =
                  url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
                  url?.includes("image") ||
                  selectedFile?.type?.startsWith("image/");
                const isPDF =
                  url?.match(/\.pdf$/i) ||
                  selectedFile?.type === "application/pdf";

                if (isImage && url) {
                  return (
                    <div className="flex-shrink-0">
                      <img
                        src={url}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded border"
                        onError={(e) => {
                          // Fallback if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                  );
                } else if (isPDF) {
                  return (
                    <div className="flex-shrink-0 w-20 h-20 rounded border bg-red-50 flex items-center justify-center">
                      <FileTextOutlined className="text-2xl text-red-600" />
                    </div>
                  );
                } else {
                  return (
                    <div className="flex-shrink-0 w-20 h-20 rounded border bg-gray-100 flex items-center justify-center">
                      <FileImageOutlined className="text-2xl text-gray-600" />
                    </div>
                  );
                }
              })()}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {selectedFile?.name ||
                    fileList[0]?.name ||
                    (previewUrl?.match(/\.pdf$/i)
                      ? "Hợp đồng.pdf"
                      : previewUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                      ? "Hợp đồng.jpg"
                      : "File đính kèm")}
                </div>
                <div className="text-xs text-gray-500">
                  {selectedFile?.type === "application/pdf" ||
                  previewUrl?.match(/\.pdf$/i)
                    ? "PDF Document"
                    : selectedFile?.type?.startsWith("image/") ||
                      previewUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                    ? "Image"
                    : "File"}
                </div>
              </div>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={handleRemoveFile}
                disabled={isLoading}
                size="small"
              >
                Xóa
              </Button>
            </div>
          </Card>
        )}
      </div>

      {!hideSubmitButton && (
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading || isExtractingPDF}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isLoading || isExtractingPDF}
            className="min-w-[120px]"
          >
            {isLoading
              ? "Đang xử lý..."
              : mode === "create"
              ? "Tạo hợp đồng"
              : "Cập nhật"}
          </Button>
        </div>
      )}
    </form>
  );
}
