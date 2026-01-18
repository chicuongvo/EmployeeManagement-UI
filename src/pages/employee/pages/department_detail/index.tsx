import { PageContainer } from "@ant-design/pro-components";
import PageTitle from "@/components/common/shared/PageTitle";
import { useDepartmentDetailContext } from "./DepartmentDetailContext";
import DepartmentHeader from "./components/DepartmentHeader";
import DepartmentInfoCard from "./components/DepartmentInfoCard";
import DepartmentChartCard from "./components/DepartmentChartCard";
import DepartmentEmployeeList from "./components/DepartmentEmployeeList";
import { Collapse } from "antd";

const Index = () => {
    const { isLoadingDepartment } = useDepartmentDetailContext();

    return (
        <PageContainer
            loading={isLoadingDepartment}
            header={{
                breadcrumb: {
                    items: [
                        {
                            title: "Phòng ban",
                        },
                        {
                            title: "Danh sách phòng ban",
                            href: "/employee/departments?limit=10&page=1&tab=1",
                        },
                        {
                            title: "Chi tiết",
                        },
                    ],
                },
            }}
            title={<PageTitle title="Chi tiết phòng ban" />}
        >
            <div className="px-6 my-3">
                {/* Header */}
                <DepartmentHeader />

                {/* Collapse: Department Overview */}
                <Collapse
                    defaultActiveKey={["overview"]}
                    bordered={false}
                    className="custom-collapse w-full mb-4"
                    items={[
                        {
                            key: "overview",
                            label: (
                                <div className="relative">
                                    <b>Tổng quan phòng ban</b>
                                </div>
                            ),
                            children: (
                                <div className="flex flex-row gap-4">
                                    {/* Left: Department Info Card - 40% width */}
                                    <div className="w-[40%]">
                                        <DepartmentInfoCard />
                                    </div>

                                    {/* Right: Chart Card - 60% width */}
                                    <div className="w-[60%]">
                                        <DepartmentChartCard />
                                    </div>
                                </div>
                            ),
                        },
                    ]}
                />

                {/* Collapse: Employee List */}
                <Collapse
                    defaultActiveKey={["employees"]}
                    bordered={false}
                    className="custom-collapse w-full"
                    items={[
                        {
                            key: "employees",
                            label: (
                                <div className="relative">
                                    <b>Danh sách nhân viên</b>
                                </div>
                            ),
                            children: <DepartmentEmployeeList />,
                        },
                    ]}
                />
            </div>
        </PageContainer>
    );
};

export default Index;
