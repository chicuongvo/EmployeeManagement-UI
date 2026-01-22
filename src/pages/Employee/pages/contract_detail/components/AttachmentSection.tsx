import { Card, Upload, Button, Image } from "antd";
import {
  InboxOutlined,
  FileTextOutlined,
  FileImageOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd/es/upload/interface";
import { useState } from "react";
import type { ContractResponse } from "@/types/Contract";

const { Dragger } = Upload;

interface AttachmentSectionProps {
  contract?: ContractResponse | null;
  isEditable?: boolean;
  onFileChange?: (file: File | null) => void;
}

const AttachmentSection = ({
  contract,
  isEditable = true,
  onFileChange,
}: AttachmentSectionProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>(
    contract?.attachment
      ? [
          {
            uid: "-1",
            name: contract.attachment.match(/\.pdf$/i)
              ? "Hợp đồng.pdf"
              : contract.attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                ? "Hợp đồng.jpg"
                : "File đính kèm",
            status: "done",
            url: contract.attachment,
          },
        ]
      : [],
  );

  const handleFileUpload: UploadProps["onChange"] = (info) => {
    const { fileList: newFileList, file } = info;
    setFileList(newFileList);

    if (
      file.originFileObj ||
      (file.status !== "removed" && file.status !== "error")
    ) {
      const uploadedFile = file.originFileObj || (file as unknown as File);
      onFileChange?.(uploadedFile);
    }

    if (file.status === "removed") {
      onFileChange?.(null);
    }
  };

  const handleRemoveFile = () => {
    setFileList([]);
    onFileChange?.(null);
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uploadProps: UploadProps = {
    accept: "image/*,.pdf",
    maxCount: 1,
    fileList: fileList,
    onChange: handleFileUpload,
    beforeUpload: () => false, // Prevent auto upload
    disabled: !isEditable,
  };

  const renderFilePreview = () => {
    if (fileList.length === 0) return null;

    const file = fileList[0];
    const url = file.url;
    const isImage =
      url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
      file.type?.startsWith("image/");
    const isPDF = url?.match(/\.pdf$/i) || file.type === "application/pdf";

    return (
      <Card size="small" className="mt-4">
        <div className="flex items-center gap-4">
          {/* File Icon/Preview */}
          <div className="flex-shrink-0">
            {isImage && url ? (
              <div className="relative">
                <Image
                  src={url}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="object-cover rounded border"
                  preview={{
                    mask: <EyeOutlined />,
                  }}
                />
              </div>
            ) : isPDF ? (
              <div className="w-20 h-20 rounded border bg-red-50 flex items-center justify-center">
                <FileTextOutlined className="text-3xl text-red-600" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded border bg-gray-100 flex items-center justify-center">
                <FileImageOutlined className="text-3xl text-gray-600" />
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{file.name}</div>
            <div className="text-xs text-gray-500">
              {isPDF ? "PDF Document" : isImage ? "Image" : "File"}
            </div>
            {file.size && (
              <div className="text-xs text-gray-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {url && (
              <Button
                type="text"
                icon={<DownloadOutlined />}
                onClick={() => handleDownload(url, file.name)}
                size="small"
                title="Tải xuống"
              />
            )}
            {isEditable && (
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={handleRemoveFile}
                size="small"
                title="Xóa file"
              />
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <FileImageOutlined className="text-blue-600" />
          <span>File đính kèm</span>
        </div>
      }
      className="shadow-sm"
    >
      {isEditable ? (
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined className="text-4xl text-gray-400" />
          </p>
          <p className="ant-upload-text text-base">
            Click hoặc kéo thả file vào đây để upload
          </p>
          <p className="ant-upload-hint text-gray-500">
            Hỗ trợ ảnh (JPG, PNG, GIF, WEBP) và PDF. Tối đa 10MB.
          </p>
        </Dragger>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {fileList.length > 0 ? "File đính kèm:" : "Không có file đính kèm"}
        </div>
      )}

      {renderFilePreview()}
    </Card>
  );
};

export default AttachmentSection;
