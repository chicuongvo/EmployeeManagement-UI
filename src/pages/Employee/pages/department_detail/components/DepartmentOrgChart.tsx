import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Avatar, Spin, Empty, Typography, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getOrgChart, type OrgChartEmployee, type OrgChartPosition } from '@/apis/department';

const { Text } = Typography;

interface DepartmentOrgChartProps {
    departmentId: number;
}

const EmployeeCard: React.FC<{ employee: OrgChartEmployee }> = ({ employee }) => {
    return (
        <Card 
            className="shadow-sm hover:shadow-md transition-shadow min-w-[200px]"
            size="small"
        >
            <div className="flex flex-col items-center gap-2">
                <Avatar 
                    size={48} 
                    src={employee.avatar} 
                    icon={!employee.avatar && <UserOutlined />}
                />
                <div className="text-center w-full">
                    <Text strong className="text-sm block truncate">{employee.fullName}</Text>
                    <Text type="secondary" className="text-xs block">{employee.employeeCode}</Text>
                    <Text type="secondary" className="text-xs block truncate">{employee.email}</Text>
                </div>
                {employee.directManager && (
                    <Tag color="blue" className="text-xs mt-1">
                        Quản lý: {employee.directManager.fullName}
                    </Tag>
                )}
            </div>
        </Card>
    );
};

const PositionNode: React.FC<{ position: OrgChartPosition }> = ({ position }) => {
    return (
        <div className="flex flex-col items-center gap-3">
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg px-4 py-2">
                <Text strong className="text-blue-700">{position.name}</Text>
                {position.roleName && (
                    <Tag color="geekblue" className="ml-2">
                        {position.roleName}
                    </Tag>
                )}
            </div>
            
            {position.employees && position.employees.length > 0 && (
                <>
                    <div className="w-px h-4 bg-blue-200"></div>
                    <div className="flex flex-row gap-4">
                        {position.employees.map((employee) => (
                            <EmployeeCard key={employee.id} employee={employee} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const DepartmentOrgChart: React.FC<DepartmentOrgChartProps> = ({ departmentId }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['org-chart', departmentId],
        queryFn: async () => {
            const response = await getOrgChart(departmentId);
            return response;
        },
        enabled: !!departmentId
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Spin size="large" />
                <Text type="secondary">Đang tải sơ đồ tổ chức...</Text>
            </div>
        );
    }

    if (!data || data.levels.length === 0) {
        return (
            <div className="py-20 text-center">
                <Empty
                    description="Không có dữ liệu sơ đồ tổ chức cho phòng ban này"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </div>
        );
    }

    return (
        <Card className="w-full overflow-x-auto overflow-y-hidden py-12 px-6 bg-white rounded-xl">
            <div className="flex flex-col gap-12 items-center min-w-max">
                {data.levels.map((level) => (
                    <div key={level.level} className="flex flex-col items-center gap-4 w-full">
                        {/* Level Header */}
                        <div className="flex items-center gap-3">
                            <Tag color="purple" className="text-sm font-semibold px-4 py-1">
                                Level {level.level}
                            </Tag>
                            <Text strong className="text-lg text-purple-700">
                                {level.roleName}
                            </Text>
                        </div>
                        
                        {/* Positions in this level */}
                        <div className="flex flex-row justify-center gap-8 flex-wrap">
                            {level.positions.map((position) => (
                                <PositionNode key={position.id} position={position} />
                            ))}
                        </div>

                        {/* Connector to next level */}
                        {level !== data.levels[data.levels.length - 1] && (
                            <div className="w-px h-8 bg-gray-300"></div>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default DepartmentOrgChart;
