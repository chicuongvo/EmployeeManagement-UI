import { useState } from "react";
import { Users, UserPlus, UserCheck, UserMinus } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import StatCard from "../../components/StatCard";
import PerformanceChart from "../../components/PerformanceChart";
import EmployeeSummaryChart from "../../components/EmployeeSummaryChart";
import EmployeeTable from "../../components/EmployeeTable";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <Header />

      <main className="ml-64 pt-16">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Dashboard Overview
            </h2>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Employees"
              value="380"
              change="8.2%"
              changeType="increase"
              icon={Users}
              iconBgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatCard
              title="Job Applicants"
              value="124"
              change="12.5%"
              changeType="increase"
              icon={UserPlus}
              iconBgColor="bg-green-50"
              iconColor="text-green-600"
            />
            <StatCard
              title="New Employees"
              value="28"
              change="5.3%"
              changeType="increase"
              icon={UserCheck}
              iconBgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <StatCard
              title="Resigned"
              value="12"
              change="2.1%"
              changeType="decrease"
              icon={UserMinus}
              iconBgColor="bg-red-50"
              iconColor="text-red-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <PerformanceChart />
            </div>
            <div>
              <EmployeeSummaryChart />
            </div>
          </div>

          <EmployeeTable />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
