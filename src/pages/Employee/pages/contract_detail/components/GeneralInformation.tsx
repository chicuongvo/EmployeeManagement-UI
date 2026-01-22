import { Form, Card, Row, Col, Input, DatePicker } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import SelectListEmployee from "@/components/common/form/SelectListEmployee";
import SelectListContractType from "@/components/common/form/SelectListContractType";
import SelectListContractStatus from "@/components/common/form/SelectListContractStatus";
import type { ContractResponse } from "@/types/Contract";
import dayjs from "dayjs";

const { TextArea } = Input;

interface GeneralInformationProps {
  contract?: ContractResponse | null;
  isEditable?: boolean;
  mode?: "create" | "edit";
}

const GeneralInformation = ({
  contract,
  isEditable = true,
  mode = "edit",
}: GeneralInformationProps) => {
  return (
    <div className="space-y-6">
      {/* Contract Basic Info */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-blue-600" />
            <span>Thông tin cơ bản</span>
          </div>
        }
        className="shadow-sm"
      >
        <div className="space-y-4">
          <Row gutter={[24, 20]}>
            <Col span={12}>
              <Form.Item
                label="Loại hợp đồng"
                name="type"
                rules={[
                  { required: true, message: "Vui lòng chọn loại hợp đồng" },
                ]}
              >
                <SelectListContractType
                  placeholder="Chọn loại hợp đồng"
                  disabled={!isEditable}
                  allowClear={false}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái" },
                ]}
              >
                <SelectListContractStatus
                  placeholder="Chọn trạng thái"
                  disabled={!isEditable}
                  allowClear={false}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          {mode !== "create" && contract?.contractCode && (
            <Row gutter={[24, 20]}>
              <Col span={12}>
                <Form.Item label="Mã hợp đồng">
                  <Input
                    value={contract.contractCode}
                    disabled
                    className="bg-gray-50"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Ngày tạo">
                  <Input
                    value={
                      contract.createdAt
                        ? dayjs(contract.createdAt).format(
                            "DD/MM/YYYY HH:mm:ss",
                          )
                        : "-"
                    }
                    disabled
                    className="bg-gray-50"
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
        </div>
      </Card>

      {/* Contract Parties */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <UserOutlined className="text-green-600" />
            <span>Các bên tham gia</span>
          </div>
        }
        className="shadow-sm"
      >
        <Row gutter={[24, 20]}>
          <Col span={12}>
            <Form.Item
              label={mode === "create" ? "Bên A" : "Nhân viên"}
              name="employeeId"
              rules={
                mode === "create"
                  ? [{ required: true, message: "Vui lòng chọn bên A" }]
                  : []
              }
            >
              <SelectListEmployee
                placeholder={
                  mode === "create" ? "Chọn bên A" : "Chọn nhân viên"
                }
                disabled={mode !== "create" || !isEditable}
                allowClear={false}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Bên B (Người ký)"
              name="signedById"
              rules={[{ required: true, message: "Vui lòng chọn bên B" }]}
            >
              <SelectListEmployee
                placeholder="Chọn bên B"
                disabled={!isEditable}
                allowClear={false}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Contract Timeline */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-orange-600" />
            <span>Thời gian hiệu lực</span>
          </div>
        }
        className="shadow-sm"
      >
        <Row gutter={[24, 20]}>
          <Col span={8}>
            <Form.Item
              label="Ngày ký"
              name="signedDate"
              rules={[{ required: true, message: "Vui lòng chọn ngày ký" }]}
            >
              <DatePicker
                placeholder="Chọn ngày ký"
                disabled={!isEditable}
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Ngày bắt đầu"
              name="startDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu" },
              ]}
            >
              <DatePicker
                placeholder="Chọn ngày bắt đầu"
                disabled={!isEditable}
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Ngày kết thúc"
              name="endDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc" },
              ]}
            >
              <DatePicker
                placeholder="Chọn ngày kết thúc"
                disabled={!isEditable}
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Additional Information */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <InfoCircleOutlined className="text-purple-600" />
            <span>Thông tin bổ sung</span>
          </div>
        }
        className="shadow-sm"
      >
        <Row gutter={[24, 20]}>
          <Col span={24}>
            <Form.Item label="Ghi chú" name="note">
              <TextArea
                placeholder="Ghi chú về hợp đồng..."
                rows={4}
                disabled={!isEditable}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default GeneralInformation;
