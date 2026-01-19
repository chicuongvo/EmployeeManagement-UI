import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getListEmployee } from "@/apis/employee/getListEmployee";
import { performanceCriteriaService } from "@/apis/performance/performanceCriteriaService";
import type { EMPLOYEE } from "@/apis/employee/model/Employee";
import type { PerformanceCriteria } from "@/apis/performance/model/PerformanceCriteria";

interface AddPerformanceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  performanceId: number;
  onSubmit: (data: PerformanceDetailSubmit) => void;
  evaluatedEmployeeIds?: number[];
}

export interface PerformanceDetailSubmit {
  employeeId: number;
  supervisorId: number;
  performanceReportId: number;
  // Optional scores if backend supports criteria scoring
  scores?: {
    criteriaId: number;
    score: number;
  }[];
}

export default function AddPerformanceDetailDialog({
  open,
  onOpenChange,
  performanceId,
  onSubmit,
  evaluatedEmployeeIds = [],
}: AddPerformanceDetailDialogProps) {
  const [employees, setEmployees] = useState<EMPLOYEE[]>([]);
  const [criteria, setCriteria] = useState<PerformanceCriteria[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [employeeData, criteriaData] = await Promise.all([
        getListEmployee({ page: 1, limit: 100 }),
        performanceCriteriaService.getAll(),
      ]);
      // API trả về dạng { data: { data: EMPLOYEE[] } }
      setEmployees(employeeData.data?.data ?? []);
      setCriteria(criteriaData ?? []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Không thể tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployees = (employees ?? []).filter((emp) =>
    !evaluatedEmployeeIds.includes(emp.id) &&
    (emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleScoreChange = (criteriaId: number, score: string) => {
    const numScore = parseFloat(score);
    if (!isNaN(numScore) && numScore >= 0 && numScore <= 5) {
      setScores((prev) => ({ ...prev, [criteriaId]: numScore }));
    }
  };

  const handleSubmit = () => {
    if (!selectedEmployee) {
      toast.error("Vui lòng chọn nhân viên");
      return;
    }
    if (!selectedSupervisor) {
      toast.error("Vui lòng chọn người đánh giá");
      return;
    }
    
    // Validate that all scores are filled in
    if (criteria.length > 0) {
      const missingScores = criteria.filter((c) => !(c.id in scores));
      if (missingScores.length > 0) {
        toast.error("Vui lòng nhập điểm cho tất cả các tiêu chí");
        return;
      }
    }

    onSubmit({
      employeeId: selectedEmployee,
      supervisorId: selectedSupervisor,
      performanceReportId: performanceId,
      // attach scores only if user entered any
      scores: Object.keys(scores).length
        ? criteria.map((c) => ({ criteriaId: c.id, score: scores[c.id] || 0 }))
        : undefined,
    });

    // Reset form
    setSelectedEmployee(null);
    setSelectedSupervisor(null);
    setScores({});
    setSearchQuery("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[18px] w-[700px] max-h-[90vh] overflow-hidden shadow-2xl mt-[40px]">
        {/* Header */}
        <div className="flex items-center justify-between px-[20px] py-[14px] border-b border-gray-100">
          <div>
            <h2 className="font-['Inter:Bold',sans-serif] font-bold text-[#343c6a] text-[18px] mb-0.5">
              Thêm đánh giá mới
            </h2>
            <p className="text-[#718ebf] text-[12px]">
              Chọn nhân viên và nhập điểm đánh giá cho từng tiêu chí
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex items-center justify-center w-[30px] h-[30px] rounded-[8px] text-[#718ebf] hover:text-[#343c6a] hover:bg-gray-100 transition-all text-[18px] font-light"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-144px)] px-[20px] py-[16px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-[100px]">
              <div className="text-[#718ebf] text-[14px]">Đang tải...</div>
            </div>
          ) : (
            <div className="space-y-[16px]">
              {/* Employee Selection */}
              <div>
                <label className="block font-['Inter:Semibold',sans-serif] font-semibold text-[#343c6a] text-[13px] mb-[6px]">
                  Nhân viên được đánh giá <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email hoặc mã nhân viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-[38px] px-[12px] border border-[#E0E0E0] rounded-[8px] font-['Inter:Regular',sans-serif] text-[13px] outline-none focus:border-[#2d60ff] focus:ring-2 focus:ring-[#2d60ff]/20 transition-all"
                />
                <div className="mt-[6px] max-h-[150px] overflow-y-auto border border-[#E0E0E0] rounded-[8px] bg-gray-50">
                  {filteredEmployees.length === 0 ? (
                    <div className="p-[12px] text-center text-[#718ebf] text-[12px]">
                      {searchQuery ? "Không tìm thấy nhân viên" : "Chưa có nhân viên khả dụng"}
                    </div>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <div
                        key={emp.id}
                        onClick={() => setSelectedEmployee(emp.id)}
                        className={`p-[8px] cursor-pointer hover:bg-blue-50 flex items-center gap-[8px] border-b border-gray-100 last:border-b-0 transition-colors ${
                          selectedEmployee === emp.id ? "bg-blue-100 border-blue-200" : "bg-white"
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={emp.avatar || "https://via.placeholder.com/36"}
                            alt={emp.fullName}
                            className="w-[36px] h-[36px] rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          {selectedEmployee === emp.id && (
                            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#2d60ff] rounded-full flex items-center justify-center">
                              <svg width="8" height="6" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-['Inter:Semibold',sans-serif] font-semibold text-[#343c6a] text-[13px] truncate">
                            {emp.fullName}
                          </div>
                          <div className="font-['Inter:Regular',sans-serif] text-[#718ebf] text-[11px] truncate">
                            {emp.email}
                          </div>
                          <div className="font-['Inter:Medium',sans-serif] text-[#2d60ff] text-[10px] mt-0.5">
                            {emp.employeeCode}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Supervisor Selection */}
              <div>
                <label className="block font-['Inter:Semibold',sans-serif] font-semibold text-[#343c6a] text-[13px] mb-[6px]">
                  Người đánh giá <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedSupervisor || ""}
                  onChange={(e) => setSelectedSupervisor(Number(e.target.value))}
                  className="w-full h-[38px] px-[12px] border border-[#E0E0E0] rounded-[8px] font-['Inter:Regular',sans-serif] text-[13px] outline-none focus:border-[#2d60ff] focus:ring-2 focus:ring-[#2d60ff]/20 transition-all bg-white"
                >
                  <option value="">Chọn người đánh giá</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} - {emp.employeeCode}
                    </option>
                  ))}
                </select>
              </div>

              {/* Performance Criteria Scores */}
              {criteria.length > 0 && (
                <div>
                  <label className="block font-['Inter:Semibold',sans-serif] font-semibold text-[#343c6a] text-[13px] mb-[6px]">
                    Tiêu chí đánh giá <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-[10px]">
                    {criteria.map((c) => (
                      <div key={c.id} className="border border-[#E0E0E0] rounded-[10px] p-[10px] bg-white hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-[10px]">
                          <div className="flex-1">
                            <div className="font-['Inter:Semibold',sans-serif] font-semibold text-[#343c6a] text-[13px] mb-[2px]">
                              {c.name}
                            </div>
                            {c.description && (
                              <div className="font-['Inter:Regular',sans-serif] text-[#718ebf] text-[11px] leading-tight">
                                {c.description}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-[4px]">
                            <div className="flex gap-[2px]">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  className="focus:outline-none"
                                  onClick={() => handleScoreChange(c.id, star.toString())}
                                >
                                  <svg
                                    className="w-[20px] h-[20px] cursor-pointer transition-all hover:scale-110 active:scale-95"
                                    viewBox="0 0 24 24"
                                    fill={star <= (scores[c.id] || 0) ? "#FFC107" : "#E0E0E0"}
                                  >
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                  </svg>
                                </button>
                              ))}
                            </div>
                            <div className="flex items-center gap-0.5">
                              <span className="font-['Inter:Bold',sans-serif] font-bold text-[#2d60ff] text-[13px]">
                                {scores[c.id] || 0}
                              </span>
                              <span className="font-['Inter:Regular',sans-serif] text-[#718ebf] text-[11px]">
                                /5
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-[8px] px-[20px] py-[12px] border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => onOpenChange(false)}
            className="h-[36px] px-[20px] rounded-[8px] border border-[#E0E0E0] font-['Inter:Medium',sans-serif] font-medium text-[#343c6a] text-[12px] hover:bg-white transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="h-[36px] px-[20px] rounded-[8px] bg-[#2d60ff] font-['Inter:Medium',sans-serif] font-medium text-white text-[12px] hover:bg-[#2350dd] transition-colors shadow-lg hover:shadow-xl"
          >
            Thêm đánh giá
          </button>
        </div>
      </div>
    </div>
  );
}
