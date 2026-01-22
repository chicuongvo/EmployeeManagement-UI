import { useState, useEffect, useMemo } from "react";
import { Modal, Form, Select, Rate, Avatar, Input, Spin, Empty } from "antd";
import { UserOutlined, SearchOutlined, StarFilled } from "@ant-design/icons";
import { toast } from "sonner";
import { getListEmployee } from "@/apis/employee/getListEmployee";
import { performanceCriteriaService } from "@/apis/performance/performanceCriteriaService";
import type { EMPLOYEE } from "@/apis/employee/model/Employee";
import type { PerformanceCriteria } from "@/apis/performance/model/PerformanceCriteria";
import { useUser } from "@/hooks/useUser";

interface AddPerformanceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  performanceId: number;
  onSubmit: (data: PerformanceDetailSubmit) => void;
  evaluatedEmployeeIds?: number[];
}

export interface PerformanceDetailSubmit {
  employeeId: number;
  supervisorId: number;
  performanceReportId: number;
  scores?: {
    criteriaId: number;
    score: number;
  }[];
}

export default function AddPerformanceDetailDialog({
  open,
  onOpenChange,
  performanceId,
  onSubmit,
  evaluatedEmployeeIds = [],
}: AddPerformanceDetailDialogProps) {
  const [form] = Form.useForm();
  const { userProfile } = useUser();
  const [employees, setEmployees] = useState<EMPLOYEE[]>([]);
  const [criteria, setCriteria] = useState<PerformanceCriteria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (open) {
      fetchData();
      form.resetFields();
      // Tự động set người đánh giá là user đang login
      if (userProfile?.id) {
        form.setFieldValue("supervisorId", userProfile.id);
      }
      setSearchQuery("");
    }
  }, [open, form, userProfile?.id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Chỉ lấy nhân viên cùng department với user đang login
      const departmentId = userProfile?.department?.id;
      const [employeeData, criteriaData] = await Promise.all([
        getListEmployee({ 
          page: 1, 
          limit: 100,
          ...(departmentId ? { departmentId } : {})
        }),
        performanceCriteriaService.getAll(),
      ]);
      setEmployees(employeeData.data?.data ?? []);
      setCriteria(criteriaData ?? []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Không thể tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter employees not yet evaluated and exclude current user
  const availableEmployees = useMemo(() => {
    return (employees ?? []).filter(
      (emp) => !evaluatedEmployeeIds.includes(emp.id) && emp.id !== userProfile?.id
    );
  }, [employees, evaluatedEmployeeIds, userProfile?.id]);

  // Filter by search query
  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return availableEmployees;
    const query = searchQuery.toLowerCase();
    return availableEmployees.filter(
      (emp) =>
        emp.fullName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.employeeCode.toLowerCase().includes(query)
    );
  }, [availableEmployees, searchQuery]);

  const employeeOptions = useMemo(() => {
    return filteredEmployees.map((emp) => ({
      value: emp.id,
      label: (
        <div className="flex items-center gap-2 py-1">
          <Avatar src={emp.avatar} size="small" icon={<UserOutlined />} />
          <span className="font-medium">{emp.fullName}</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-500">{emp.employeeCode}</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-500">{emp.email}</span>
        </div>
      ),
      searchText: `${emp.fullName} ${emp.email} ${emp.employeeCode}`,
    }));
  }, [filteredEmployees]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Build scores array from form values
      const scores = criteria.map((c) => ({
        criteriaId: c.id,
        score: values[`criteria_${c.id}`] || 0,
      }));

      // Check if all scores are filled
      const missingScores = scores.filter((s) => s.score === 0);
      if (missingScores.length > 0 && criteria.length > 0) {
        toast.error("Vui lòng nhập điểm cho tất cả các tiêu chí");
        return;
      }

      setSubmitting(true);
      await onSubmit({
        employeeId: values.employeeId,
        supervisorId: values.supervisorId,
        performanceReportId: performanceId,
        scores: criteria.length > 0 ? scores : undefined,
      });

      form.resetFields();
      setSearchQuery("");
      onOpenChange(false);
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSearchQuery("");
    onOpenChange(false);
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <UserOutlined className="text-blue-500" />
          <span>Thêm đánh giá nhân viên</span>
        </div>
      }
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="Thêm đánh giá"
      cancelText="Hủy"
      confirmLoading={submitting}
      okButtonProps={{
        className: "bg-green-500 hover:bg-green-600",
      }}
      width={600}
      destroyOnClose
    >
      <Spin spinning={isLoading}>
        <div className="py-4">
          <p className="text-gray-500 mb-4">
            Chọn nhân viên và nhập điểm đánh giá cho từng tiêu chí
          </p>

          <Form form={form} layout="vertical">
            {/* Employee Selection */}
            <Form.Item
              name="employeeId"
              label="Nhân viên được đánh giá"
              rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}
            >
              <Select
                placeholder="Tìm kiếm và chọn nhân viên..."
                options={employeeOptions}
                showSearch
                filterOption={(input, option) =>
                  (option?.searchText ?? "").toLowerCase().includes(input.toLowerCase())
                }
                notFoundContent={
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Không tìm thấy nhân viên"
                  />
                }
                size="large"
                popupMatchSelectWidth={false}
                listHeight={300}
                style={{ width: "100%" }}
                dropdownStyle={{ minWidth: 400 }}
              />
            </Form.Item>

            {/* Supervisor Selection - Tự động là user đang login */}
            <Form.Item
              name="supervisorId"
              label="Người đánh giá"
              rules={[{ required: true, message: "Vui lòng chọn người đánh giá" }]}
            >
              <Select
                disabled
                size="large"
                options={[
                  {
                    value: userProfile?.id,
                    label: (
                      <div className="flex items-center gap-2">
                        <Avatar src={userProfile?.avatar} size="small" icon={<UserOutlined />} />
                        <span>{userProfile?.fullName}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-500">{userProfile?.employeeCode}</span>
                      </div>
                    ),
                  },
                ]}
              />
            </Form.Item>

            {/* Criteria Scores */}
            {criteria.length > 0 && (
              <div className="mt-4">
                <label className="block font-medium text-gray-700 mb-3">
                  Tiêu chí đánh giá <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {criteria.map((c) => (
                    <div
                      key={c.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{c.name}</div>
                          {c.description && (
                            <div className="text-sm text-gray-500 mt-1">
                              {c.description}
                            </div>
                          )}
                        </div>
                        <Form.Item
                          name={`criteria_${c.id}`}
                          className="mb-0"
                          rules={[{ required: true, message: "Bắt buộc" }]}
                        >
                          <Rate
                            character={<StarFilled />}
                            className="text-yellow-400"
                          />
                        </Form.Item>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Form>
        </div>
      </Spin>
    </Modal>
  );
}
