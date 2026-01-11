import React, { useState, useEffect } from "react";
import { Upload, Button } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { cn } from "@/lib/utils";
import { useUploadFile } from "@/apis/upload_file/uploadFile";
import { toast } from "sonner";

interface FileUploadProps {
  urlFile?: string;
  onRemove?: () => void;
  onChange?: (url: string | null) => void;
  disabled?: boolean;
  className?: string;
  accept?: string;
  placeholder?: string;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const FileUpload: React.FC<FileUploadProps> = ({
  urlFile,
  onRemove,
  onChange,
  disabled,
  className,
  accept = "application/pdf",
  placeholder = "Tải lên file",
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (urlFile) {
      setFileList([
        {
          uid: String(Date.now()),
          name: urlFile.split("/").pop() || "file.pdf",
          status: "done",
          url: urlFile,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [urlFile]);

  const { mutateAsync: uploadFile } = useUploadFile({
    onSuccess: (response) => {
      const uploadedUrl = response.data?.url;
      if (!uploadedUrl) {
        toast.error("Upload failed: Invalid response");
        onChange?.(null);
        setIsUploading(false);
        return;
      }

      const newFile: UploadFile = {
        uid: String(Date.now()),
        name: response.data?.file_name || "file.pdf",
        status: "done",
        url: uploadedUrl,
      };

      setFileList([newFile]);
      onChange?.(uploadedUrl);
      setIsUploading(false);
    },
    onError: () => {
      onChange?.(null);
      setIsUploading(false);
    },
  });

  const beforeUpload = (file: FileType) => {
    const isValidType = file.type === accept || accept === "*";
    if (!isValidType) {
      toast.error(
        `Bạn chỉ có thể tải lên file ${
          accept === "application/pdf" ? "PDF" : accept
        }!`
      );
      return Upload.LIST_IGNORE;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      toast.error("File phải nhỏ hơn 10MB!");
      return Upload.LIST_IGNORE;
    }

    setIsUploading(true);
    uploadFile(file as File).catch(() => {
      setIsUploading(false);
    });

    return Upload.LIST_IGNORE;
  };

  const handleChange = ({ fileList: newList }: { fileList: UploadFile[] }) => {
    setFileList(newList);
    if (!newList?.length) {
      onChange?.(null);
    }
  };

  const handleRemove = () => {
    setFileList([]);
    onRemove?.();
    onChange?.(null);
  };

  const handlePreview = (file: UploadFile) => {
    if (file.url) {
      window.open(file.url, "_blank");
    }
  };

  return (
    <div className={cn("file-upload-wrapper", className)}>
      <Upload
        fileList={fileList}
        onChange={handleChange}
        onRemove={handleRemove}
        onPreview={handlePreview}
        beforeUpload={beforeUpload}
        maxCount={1}
        accept={accept}
        disabled={disabled || isUploading}
        listType="text"
        className="file-upload-button"
      >
        {fileList.length < 1 && (
          <Button
            icon={<UploadOutlined />}
            disabled={disabled || isUploading}
            loading={isUploading}
            style={{
              borderStyle: "dashed",
            }}
          >
            {placeholder}
          </Button>
        )}
      </Upload>
    </div>
  );
};

export default FileUpload;
