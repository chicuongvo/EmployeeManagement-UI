import React, { useState, useEffect, useRef } from "react";
import { Image as AntdImage, Modal, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { cn } from "@/lib/utils";
import { useUploadFile } from "@/apis/upload_file/uploadFile";
import { toast } from "sonner";
import PrimaryButton from "../button/PrimaryButton";

interface ImageUploadProps {
  urlImage?: string;
  onRemove?: () => void;
  onChange?: (url: string | null) => void;
  disabled?: boolean;
  className?: string;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const getCroppedFile = async (
  image: HTMLImageElement,
  crop: Crop,
  fileName: string,
  mimeType = "image/jpeg"
): Promise<File> => {
  if (!crop.width || !crop.height) {
    throw new Error("Invalid crop");
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Cannot get canvas context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const outputWidth = crop.width * scaleX;
  const outputHeight = crop.height * scaleY;

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    outputWidth,
    outputHeight,
    0,
    0,
    outputWidth,
    outputHeight
  );

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Canvas is empty"));
        resolve(new File([blob], fileName, { type: mimeType }));
      },
      mimeType,
      1
    );
  });
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  urlImage,
  onRemove,
  onChange,
  disabled,
  className,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // state for crop modal
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>();
  const [crop, setCrop] = useState<Crop>();
  const [cropImgKey, setCropImgKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const originalFileRef = useRef<FileType | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (urlImage) {
      setFileList([
        {
          uid: String(Date.now()),
          name: "image.png",
          status: "done",
          url: urlImage,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [urlImage]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;

    setCrop({
      unit: "px",
      x: 0,
      y: 0,
      width,
      height,
    });
  };

  const beforeUpload = async (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

    if (!isJpgOrPng) {
      toast.error("Bạn chỉ có thể tải lên file JPG/PNG!");
      return Upload.LIST_IGNORE;
    }

    originalFileRef.current = file;
    const base64 = await getBase64(file);
    setImageSrc(base64);
    setCrop(undefined);
    setCropImgKey((prev) => prev + 1);
    setCropModalOpen(true);
    return Upload.LIST_IGNORE;
  };

  const handleChange = ({ fileList: newList }: { fileList: UploadFile[] }) => {
    setFileList(newList);
    if (!newList?.length) {
      onChange?.(null);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleRemove = () => {
    setFileList([]);
    onRemove?.();
    onChange?.(null);
  };

  const { mutateAsync: uploadFile } = useUploadFile({
    onSuccess: (response) => {
      const uploadedUrl = response.data?.url;
      if (!uploadedUrl) {
        toast.error("Upload failed: Invalid response");
        onChange?.(null);
        return;
      }

      const newFile: UploadFile = {
        uid: String(Date.now()),
        name: response.data?.file_name || "image",
        status: "done",
        url: uploadedUrl,
      };

      setFileList([newFile]);
      onChange?.(uploadedUrl);
      setCropModalOpen(false);
      setImageSrc(undefined);
      originalFileRef.current = null;
    },
    onError: () => {
      onChange?.(null);
    },
  });

  const handleCropConfirm = async () => {
    if (!imageSrc || !originalFileRef.current || !imgRef.current || !crop) {
      toast.error("No data to crop!");
      return;
    }

    try {
      setIsLoading(true);
      const croppedFile = await getCroppedFile(
        imgRef.current,
        crop,
        originalFileRef.current.name,
        originalFileRef.current.type || "image/jpeg"
      );

      await uploadFile(croppedFile);
    } catch (err) {
      toast.error((err as Error).message);
      onChange?.(null);
    }
    setIsLoading(false);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
        onPreview={handlePreview}
        onRemove={handleRemove}
        beforeUpload={beforeUpload}
        className={cn("custom-image-upload", className)}
        maxCount={1}
        accept="image/*"
        disabled={disabled}
      >
        {fileList.length < 1 ? uploadButton : null}
      </Upload>

      <Modal
        open={cropModalOpen}
        title="Cắt "
        width={700}
        onCancel={() => {
          setCropModalOpen(false);
          setImageSrc(undefined);
          originalFileRef.current = null;
        }}
        maskClosable={false}
        footer={null}
      >
        <div className="flex justify-center">
          {imageSrc && (
            <ReactCrop
              key={cropImgKey}
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="crop"
                style={{ maxWidth: "100%", maxHeight: 500 }}
                onLoad={handleImageLoad}
              />
            </ReactCrop>
          )}
        </div>
        <div className="flex justify-end pt-4 gap-2">
          <PrimaryButton
            key="cancel"
            onClick={() => {
              setCropModalOpen(false);
              setImageSrc(undefined);
              originalFileRef.current = null;
            }}
            disabled={isLoading}
            color="white"
          >
            Hủy
          </PrimaryButton>
          <PrimaryButton
            key="save"
            onClick={handleCropConfirm}
            color="green"
            disabled={isLoading}
            loading={isLoading}
          >
            Xác nhận
          </PrimaryButton>
        </div>
      </Modal>

      {previewImage && (
        <AntdImage
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default ImageUpload;
