import { useState } from "react";
import { Button, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useProjectDetail } from "../../ProjectDetailContext";
import MemberTable from "./MemberTable";
import FormAddMembers from "./FormAddMembers";

const ProjectMemberPage = () => {
    const { projectId, members, isLoadingMembers, refetchMembers } = useProjectDetail();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const existingMemberIds = members.map(m => m.employeeId);

    const handleMemberAdded = () => {
        refetchMembers();
    };

    const handleMemberRemoved = () => {
        refetchMembers();
    };

    if (isLoadingMembers) {
        return (
            <div className="flex justify-center items-center h-96">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-4 flex justify-between items-center">
                <div className="text-lg font-semibold">
                    Thành viên dự án ({members.length})
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Thêm thành viên
                </Button>
            </div>

            {/* Member Table */}
            <MemberTable
                members={members}
                projectId={projectId}
                isLoading={isLoadingMembers}
                onMemberRemoved={handleMemberRemoved}
            />

            {/* Add Members Modal */}
            <FormAddMembers
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                projectId={projectId}
                existingMemberIds={existingMemberIds}
                onSuccess={handleMemberAdded}
            />
        </div>
    );
};

export default ProjectMemberPage;
