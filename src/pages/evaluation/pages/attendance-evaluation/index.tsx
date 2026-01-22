import { PageContainer } from "@ant-design/pro-components";
import { Tabs, type TabsProps } from "antd";
import PageTitle from "@/components/common/shared/PageTitle";
import FormFilter from "./components/FormFilter";
import DataTable from "./components/DataTable";
import { useAttendanceContext } from "./AttendanceContext";

export const TABS = {
    ATTENDANCE: "1",
    LEAVE_APPLICATION: "2",
};

export default function AttendancePage() {
    const { tab } = useAttendanceContext();

    const tabs: TabsProps["items"] = [
        {
            key: TABS.ATTENDANCE,
            label: "Báo cáo chuyên cần",
            children: (
                <>
                    <FormFilter />
                    <DataTable />
                </>
            ),
        },
        {
            key: TABS.LEAVE_APPLICATION,
            label: "Đơn nghỉ phép",
            children: (
                <>
                    <FormFilter />
                    <DataTable />
                </>
            ),
        },
    ];

    return (
        <PageContainer
            header={{
                breadcrumb: {
                    items: [
                        {
                            title: "Đánh giá",
                        },
                        {
                            title: "Đánh giá chuyên cần",
                        },
                    ],
                },
            }}
            title={<PageTitle title="Đánh giá chuyên cần" />}
        >
            <Tabs
                type="card"
                activeKey={tab ?? TABS.ATTENDANCE}
                className="tag-ticket-list report-tab"
                items={tabs}
            />
        </PageContainer>
    );
}
