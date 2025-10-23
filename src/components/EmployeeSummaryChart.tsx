import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const data = [
  { name: "Engineering", value: 156, color: "#3b82f6" },
  { name: "Sales", value: 89, color: "#10b981" },
  { name: "Marketing", value: 67, color: "#f59e0b" },
  { name: "Operations", value: 45, color: "#8b5cf6" },
  { name: "HR", value: 23, color: "#ec4899" },
];

const EmployeeSummaryChart = () => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Employees by Department
        </h3>
        <p className="text-sm text-gray-500 mt-1">Total: {total} employees</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-3">
        {data.map(dept => (
          <div key={dept.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: dept.color }}
              />
              <span className="text-sm text-gray-700">{dept.name}</span>
            </div>
            <span className="text-sm font-medium text-gray-800">
              {dept.value} ({Math.round((dept.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeSummaryChart;
