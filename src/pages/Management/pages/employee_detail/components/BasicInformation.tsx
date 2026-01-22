import { Avatar, Card, Divider } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useEmployeeDetailContext } from "../EmployeeDetailContex";
import React, { useCallback, useMemo } from "react";
import { WorkStatus } from "@/components/common/status";

const DEFAULT_AVATAR =
  "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg";

const BasicInformation = () => {
  const { employee } = useEmployeeDetailContext();

  const handleDepartmentClick = useCallback(() => {
    if (employee?.departmentId) {
      window.location.href = `/employee/departments/${employee.departmentId}`;
    }
  }, [employee?.departmentId]);

  const handleManagerClick = useCallback(() => {
    if (employee?.department?.managerId) {
      window.location.href = `/management/employees/${employee.department.managerId}`;
    }
  }, [employee?.department?.managerId]);

  const avatarUrl = useMemo(
    () => employee?.avatar || DEFAULT_AVATAR,
    [employee?.avatar],
  );

  const positionName = useMemo(
    () => employee?.position?.name || "N/A",
    [employee?.position?.name],
  );

  const departmentName = useMemo(
    () => employee?.department?.name || "N/A",
    [employee?.department?.name],
  );

  if (!employee) {
    return null;
  }

  return (
    <div className="w-[300px] flex-shrink-0 mb-4">
      <Card className="rounded-2xl" bodyStyle={{ padding: "20px" }}>
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6 gap-[10px]">
          <Avatar src={avatarUrl} size={130} className="mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 text-center">
            {employee.fullName}
          </h3>
          <p className="text-sm text-gray-500">{positionName}</p>
          <WorkStatus status={employee.workStatus} />
        </div>

        <Divider />
        {/* Contact Information */}
        <div className="mb-6 space-y-[19px]">
          <div className="flex items-center gap-3">
            <MailOutlined className="text-gray-400 text-base" />
            <span className="text-sm text-gray-700">{employee.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <PhoneOutlined className="text-gray-400 text-base" />
            <span className="text-sm text-gray-700">{employee.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <ClockCircleOutlined className="text-gray-400 text-base" />
            <span className="text-sm text-gray-700">GTM +07:00</span>
          </div>
        </div>

        <Divider />
        {/* Organization Info */}
        <div className="mb-6 space-y-1">
          {/* Department */}
          <div
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={handleDepartmentClick}
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 mb-1">Phòng ban</span>
              <span className="text-sm font-medium text-gray-800">
                {departmentName}
              </span>
            </div>
            <RightOutlined className="text-zinc-200 text-xs" />
          </div>

          {/* Manager */}
          {employee.department?.manager && (
            <div
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={handleManagerClick}
            >
              <div className="flex items-center gap-2 flex-1">
                <div className="flex flex-col flex-1 gap-1">
                  <span className="text-xs text-gray-500 mb-1">Quản lý</span>
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={
                        employee?.department?.manager?.avatar || DEFAULT_AVATAR
                      }
                      size={24}
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {employee.department.manager.fullName}
                    </span>
                  </div>
                </div>
              </div>
              <RightOutlined className="text-zinc-200 text-xs" />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default React.memo(BasicInformation);
