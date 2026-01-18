import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { PerformanceDetail } from "@/apis/performance/model/Performance";
import type { PerformanceCriteria } from "@/apis/performance/model/PerformanceCriteria";
import { performanceCriteriaService } from "@/apis/performance/performanceCriteriaService";
import { performanceDetailScoreService } from "@/apis/performance/performanceDetailScoreService";
import defaultAvatar from "/public/default-avatar.svg";

interface ViewPerformanceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detail: PerformanceDetail | null;
  onUpdate?: () => void;
}

export default function ViewPerformanceDetailDialog({
  open,
  onOpenChange,
  detail,
  onUpdate,
}: ViewPerformanceDetailDialogProps) {
  const [criteria, setCriteria] = useState<PerformanceCriteria[]>([]);
  const [editedScores, setEditedScores] = useState<Record<number, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (open && detail) {
      fetchCriteria();
      // Initialize edited scores with current scores
      const initialScores: Record<number, number> = {};
      detail.scores?.forEach((score) => {
        initialScores[score.performanceCriteriaId] = score.score;
      });
      setEditedScores(initialScores);
    }
  }, [open, detail]);

  const fetchCriteria = async () => {
    try {
      const criteriaData = await performanceCriteriaService.getAll();
      setCriteria(criteriaData);
    } catch (error) {
      console.error("Failed to fetch criteria:", error);
    }
  };

  const getOriginalScoreByCriteriaId = (criteriaId: number): number | null => {
    // Only get from original detail.scores, not editedScores
    if (!detail?.scores) return null;
    const scoreObj = detail.scores.find((s) => s.performanceCriteriaId === criteriaId);
    return scoreObj ? scoreObj.score : null;
  };

  const getScoreByCriteriaId = (criteriaId: number): number | null => {
    // Use edited score if available, otherwise use original
    if (criteriaId in editedScores) {
      return editedScores[criteriaId];
    }
    if (!detail?.scores) return null;
    const scoreObj = detail.scores.find((s) => s.performanceCriteriaId === criteriaId);
    return scoreObj ? scoreObj.score : null;
  };

  const handleStarClick = (criteriaId: number, starValue: number) => {
    setEditedScores((prev) => ({
      ...prev,
      [criteriaId]: starValue,
    }));
  };

  const handleSave = async () => {
    if (!detail) return;

    try {
      setIsSaving(true);
      
      // Update each modified score via performance-detail-score endpoint
      const updatePromises = Object.entries(editedScores).map(async ([criteriaId, newScore]) => {
        const scoreRecord = detail.scores?.find(
          (s) => s.performanceCriteriaId === parseInt(criteriaId)
        );
        
        if (scoreRecord) {
          // Update existing score with both criteriaId and score
          await performanceDetailScoreService.update(scoreRecord.id, { 
            performanceCriteriaId: parseInt(criteriaId),
            score: newScore 
          });
        }
      });

      await Promise.all(updatePromises);
      
      toast.success("Cập nhật đánh giá thành công!");
      onOpenChange(false);
      
      // Call onUpdate callback to refresh data
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to update scores:", error);
      toast.error("Không thể cập nhật đánh giá");
    } finally {
      setIsSaving(false);
    }
  };

  const renderStars = (criteriaId: number, score: number) => {
    return (
      <div className="flex gap-[4px]">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className="w-[20px] h-[20px] cursor-pointer transition-transform hover:scale-110"
            viewBox="0 0 24 24"
            fill={star <= score ? "#FFC107" : "#E0E0E0"}
            onClick={() => handleStarClick(criteriaId, star)}
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        ))}
      </div>
    );
  };

  if (!open || !detail) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[18px] w-[700px] max-h-[90vh] overflow-hidden shadow-2xl mt-[40px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2D60FF] to-[#5B8EFF] px-[20px] py-[16px] flex items-center justify-between">
          <div className="flex items-center gap-[12px]">
            <div className="bg-white rounded-[12px] w-[48px] h-[48px] flex items-center justify-center shadow-lg">
              <svg className="w-[24px] h-[24px]" fill="#2D60FF" viewBox="0 0 24 24">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2M18 20H6V4H13V9H18V20M10 19L12 15H9V10L7 14H10V19Z" />
              </svg>
            </div>
            <div className="text-white">
              <h2 className="font-['Inter:Bold',sans-serif] font-bold text-[18px] mb-0.5">
                Báo cáo #{String(detail.performanceReportId).padStart(3, "0")}
              </h2>
              <p className="font-['Inter:Regular',sans-serif] text-white/80 text-[12px]">
                Chi tiết đánh giá hiệu suất làm việc
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex items-center justify-center w-[32px] h-[32px] rounded-[8px] bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6L18 18" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-[20px] py-[16px] space-y-[16px]">
          {/* Employee Section */}
          <div>
            <div className="flex items-center gap-[10px] mb-[10px]">
              <div className="w-[20px] h-[20px] rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-[12px] h-[12px]" fill="#2D60FF" viewBox="0 0 24 24">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
                </svg>
              </div>
              <h3 className="font-['Inter:Semibold',sans-serif] font-semibold text-[#343C6A] text-[14px]">
                Thông tin nhân viên
              </h3>
            </div>
            <div className="flex items-center gap-[12px] bg-gradient-to-r from-blue-50 to-indigo-50 rounded-[12px] p-[12px] border border-blue-100">
              <img
                src={detail.employee?.avatar || defaultAvatar}
                alt={detail.employee?.fullName || "Unknown"}
                className="w-[48px] h-[48px] rounded-full object-cover border-2 border-white shadow-md"
              />
              <div className="flex-1">
                <p className="font-['Inter:Semibold',sans-serif] font-semibold text-[#343C6A] text-[14px]">
                  {detail.employee?.fullName || "N/A"}
                </p>
                <p className="font-['Inter:Regular',sans-serif] text-[#718EBF] text-[12px] mt-0.5">
                  {detail.employee?.email || ""}
                </p>
                {detail.employee?.employeeCode && (
                  <p className="font-['Inter:Medium',sans-serif] text-[#2D60FF] text-[11px] mt-0.5">
                    Mã NV: {detail.employee.employeeCode}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Evaluation Details Section */}
          <div>
            <div className="flex items-center gap-[10px] mb-[16px]">
              <div className="w-[24px] h-[24px] rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-[14px] h-[14px]" fill="#2D60FF" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <h3 className="font-['Inter:Semibold',sans-serif] font-semibold text-[#343C6A] text-[16px]">
                Tiêu chí đánh giá
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-[16px]">
              {criteria.map((criterion) => {
                const originalScore = getOriginalScoreByCriteriaId(criterion.id);
                const displayScore = getScoreByCriteriaId(criterion.id);
                const hasScore = originalScore !== null || criterion.id in editedScores;
                return (
                  <div key={criterion.id} className="border border-gray-200 rounded-[16px] p-[18px] hover:shadow-md transition-shadow">
                    <p className="font-['Inter:Semibold',sans-serif] font-semibold text-[#343C6A] text-[15px] mb-[12px]">
                      {criterion.name}
                    </p>
                    {criterion.description && (
                      <p className="font-['Inter:Regular',sans-serif] text-[#718EBF] text-[13px] mb-[12px] leading-relaxed">
                        {criterion.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-[3px]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleStarClick(criterion.id, star)}
                            className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                          >
                            <svg
                              className="w-[18px] h-[18px] cursor-pointer"
                              viewBox="0 0 24 24"
                              fill={hasScore && star <= (displayScore || 0) ? "#FFC107" : "#E0E0E0"}
                            >
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                      {hasScore && (
                        <div className="flex items-center gap-0.5">
                          <span className="font-['Inter:Bold',sans-serif] font-bold text-[#2D60FF] text-[12px]">
                            {displayScore || 0}
                          </span>
                          <span className="font-['Inter:Regular',sans-serif] text-[#718EBF] text-[10px]">
                            /5
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Average Score Section */}
          {detail.scores && detail.scores.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-[12px] p-[14px] border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-['Inter:Regular',sans-serif] text-[#718EBF] text-[12px] mb-1">
                    Điểm trung bình chung
                  </p>
                  <p className="font-['Inter:Bold',sans-serif] font-bold text-[#343C6A] text-[20px]">
                    {(detail.scores.reduce((sum, s) => sum + s.score, 0) / detail.scores.length).toFixed(1)}
                    <span className="text-[14px] font-semibold text-[#718EBF]"> / 5</span>
                  </p>
                </div>
                <div className="flex gap-[2px]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-[20px] h-[20px]"
                      viewBox="0 0 24 24"
                      fill={star <= Math.round(detail.scores.reduce((sum, s) => sum + s.score, 0) / detail.scores.length) ? "#FFC107" : "#E0E0E0"}
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-[8px] px-[20px] py-[12px] border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="h-[36px] px-[20px] rounded-[8px] border border-[#E0E0E0] font-['Inter:Medium',sans-serif] font-medium text-[#343c6a] text-[12px] hover:bg-white transition-colors disabled:opacity-50"
          >
            Đóng
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="h-[36px] px-[20px] rounded-[8px] bg-[#2D60FF] font-['Inter:Medium',sans-serif] font-medium text-white text-[12px] hover:bg-[#2350DD] transition-colors shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
