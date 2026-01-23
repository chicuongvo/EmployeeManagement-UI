import { PageContainer } from "@ant-design/pro-components";
import { Card, Table, Tag, Typography, Spin, Alert } from "antd";
import { FaProjectDiagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PageTitle from "@/components/common/shared/PageTitle";
import { getMyProjects, type Project, ProjectStatus } from "@/apis/project";

const { Title, Text } = Typography;

const MyProjectsPage = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-projects"],
    queryFn: getMyProjects,
  });

  const projects = data?.data || [];
  const activeProjects = projects.filter(
    (p) => p.status === ProjectStatus.IN_PROGRESS,
  );
  const completedProjects = projects.filter(
    (p) => p.status === ProjectStatus.COMPLETED,
  );

  const columns = [
    {
      title: "Tên dự án",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Project) => (
        <a
          href={`/management/projects/${record.id}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/management/projects/${record.id}`);
          }}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {text}
        </a>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: ProjectStatus) => {
        const statusConfig = {
          [ProjectStatus.IN_PROGRESS]: {
            color: "green",
            text: "Đang thực hiện",
          },
          [ProjectStatus.COMPLETED]: { color: "blue", text: "Hoàn thành" },
          [ProjectStatus.ON_HOLD]: { color: "orange", text: "Tạm dừng" },
          [ProjectStatus.PLANNING]: { color: "cyan", text: "Lên kế hoạch" },
          [ProjectStatus.CANCELLED]: { color: "red", text: "Đã hủy" },
        };
        const config = statusConfig[status] || {
          color: "default",
          text: status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Quản lý",
      dataIndex: "manager",
      key: "manager",
      render: (manager: any) => manager?.fullName || "N/A",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "N/A",
    },
  ];

  if (isLoading) {
    return (
      <PageContainer
        header={{
          breadcrumb: {
            items: [
              {
                title: "Thông tin cá nhân",
              },
              {
                title: "Dự án của tôi",
              },
            ],
          },
        }}
        title={<PageTitle title="Dự án của tôi" />}
      >
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer
        header={{
          breadcrumb: {
            items: [
              {
                title: "Thông tin cá nhân",
              },
              {
                title: "Dự án của tôi",
              },
            ],
          },
        }}
        title={<PageTitle title="Dự án của tôi" />}
      >
        <Alert
          message="Lỗi"
          description="Không thể tải danh sách dự án. Vui lòng thử lại sau."
          type="error"
          showIcon
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      header={{
        breadcrumb: {
          items: [
            {
              title: "Thông tin cá nhân",
            },
            {
              title: "Dự án của tôi",
            },
          ],
        },
      }}
      title={<PageTitle title="Dự án của tôi" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaProjectDiagram className="text-blue-600 text-2xl" />
              </div>
              <div>
                <Text className="text-gray-600 text-sm">Tổng dự án</Text>
                <Title level={3} className="!mb-0">
                  {projects.length}
                </Title>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaProjectDiagram className="text-green-600 text-2xl" />
              </div>
              <div>
                <Text className="text-gray-600 text-sm">Đang thực hiện</Text>
                <Title level={3} className="!mb-0">
                  {activeProjects.length}
                </Title>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaProjectDiagram className="text-purple-600 text-2xl" />
              </div>
              <div>
                <Text className="text-gray-600 text-sm">Đã hoàn thành</Text>
                <Title level={3} className="!mb-0">
                  {completedProjects.length}
                </Title>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <Table
            columns={columns}
            dataSource={projects}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Tổng số ${total} dự án`,
            }}
          />
        </Card>
      </div>
    </PageContainer>
  );
};

export default MyProjectsPage;
