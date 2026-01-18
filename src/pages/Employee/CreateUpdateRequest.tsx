import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Send, ArrowLeft, User } from "lucide-react";
import { toast } from "react-toastify";
import { createUpdateRequest } from "@/services/update-request";
import type { CreateUpdateRequestRequest } from "@/types/UpdateRequest";

const CreateUpdateRequest = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    requestedById: 1, // Tạm thời hardcode, sau này sẽ lấy từ context user
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      toast.error("Vui lòng nhập nội dung yêu cầu");
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData: CreateUpdateRequestRequest = {
        content: formData.content.trim(),
        requestedById: formData.requestedById,
      };

      await createUpdateRequest(requestData);
      toast.success("Gửi yêu cầu cập nhật thành công!");

      // Reset form
      setFormData({
        content: "",
        requestedById: 1,
      });

      // Có thể navigate về trang danh sách yêu cầu của nhân viên
      // navigate("/employee/my-requests");
    } catch (error) {
      toast.error("Gửi yêu cầu thất bại. Vui lòng thử lại!");
      console.error("Error creating update request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      content: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tạo yêu cầu cập nhật thông tin
            </h1>
            <p className="text-gray-600">
              Gửi yêu cầu cập nhật thông tin cá nhân của bạn
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin yêu cầu
            </CardTitle>
            <CardDescription>
              Vui lòng mô tả chi tiết những thông tin bạn muốn cập nhật
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Content Field */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Nội dung yêu cầu <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  placeholder="Ví dụ: Tôi muốn cập nhật số điện thoại từ 0123456789 thành 0987654321 và địa chỉ từ 'Hà Nội' thành 'TP. Hồ Chí Minh'..."
                  value={formData.content}
                  onChange={handleContentChange}
                  rows={8}
                  className="resize-none"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">
                  Hãy mô tả rõ ràng những thông tin cần thay đổi và giá trị mới
                  mong muốn
                </p>
              </div>

              {/* Character count */}
              <div className="text-right">
                <span className="text-xs text-gray-500">
                  {formData.content.length} ký tự
                </span>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.content.trim()}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Gửi yêu cầu
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Hướng dẫn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Cách viết yêu cầu hiệu quả:
                </h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    Nêu rõ thông tin cần thay đổi (tên, số điện thoại, địa chỉ,
                    email...)
                  </li>
                  <li>Ghi rõ giá trị hiện tại và giá trị mới mong muốn</li>
                  <li>Nêu lý do cần thay đổi (nếu cần thiết)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">Ví dụ:</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="italic">
                    "Tôi muốn cập nhật thông tin sau:
                    <br />
                    - Số điện thoại: từ 0123456789 thành 0987654321
                    <br />
                    - Địa chỉ: từ '123 Đường ABC, Quận 1, TP.HCM' thành '456
                    Đường XYZ, Quận 2, TP.HCM'
                    <br />
                    Lý do: Tôi đã chuyển nhà và đổi số điện thoại mới."
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateUpdateRequest;
