/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  SearchOutlined,
  ExportOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Space } from "antd";
import { useSearchParams } from "react-router-dom";

import PrimaryButton from "../button/PrimaryButton";

interface BoxFilterProps {
  loading?: boolean;
  canSearch?: boolean;
  canExport?: boolean;
  onReset?: () => void;
  setIsExport?: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}

const BoxFilter: React.FC<BoxFilterProps> = ({
  loading,
  canSearch,
  onReset,
  canExport,
  setIsExport,
  children,
}) => {
  const [_, setSearchParams] = useSearchParams();

  return (
    <div className="flex justify-between gap-4">
      <div className="flex-1">{children}</div>
      {canSearch && (
        <Space size="middle">
          <PrimaryButton
            onClick={() => {
              onReset ? onReset() : setSearchParams();
            }}
            className="bg-transparent border text-primary-100 border-primary-100 hover:bg-transparent"
            disabled={loading}
            loading={loading}
            icon={<SyncOutlined className="icon-hover-effect" />}
            key="reset"
            type="button"
          >
            Đặt lại
          </PrimaryButton>

          <PrimaryButton
            disabled={loading}
            loading={loading}
            icon={<SearchOutlined className="icon-hover-effect" />}
            key="search"
            type="submit"
            color="green"
          >
            Tìm kiếm
          </PrimaryButton>

          {canExport && (
            <PrimaryButton
              icon={<ExportOutlined className="icon-hover-effect" />}
              onClick={() => setIsExport && setIsExport(true)}
              className="px-4"
              disabled={loading}
              loading={loading}
              color="orange"
            >
              Export
            </PrimaryButton>
          )}
        </Space>
      )}
    </div>
  );
};

export default BoxFilter;
