import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Modal, Rate, Avatar, Spin, Card, Typography, Divider, Button, Tag } from "antd";
import { UserOutlined, StarOutlined, TrophyOutlined } from "@ant-design/icons";
import type { PerformanceDetail } from "@/apis/performance/model/Performance";
import type { PerformanceCriteria } from "@/apis/performance/model/PerformanceCriteria";
import { performanceCriteriaService } from "@/apis/performance/performanceCriteriaService";
import { performanceDetailScoreService } from "@/apis/performance/performanceDetailScoreService";
import defaultAvatar from "/public/default-avatar.svg";

const { Text, Title } = Typography;

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
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      const criteriaData = await performanceCriteriaService.getAll();
      setCriteria(criteriaData);
    } catch (error) {
      console.error("Failed to fetch criteria:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreByCriteriaId = (criteriaId: number): number => {
    if (criteriaId in editedScores) {
      return editedScores[criteriaId];
    }
    if (!detail?.scores) return 0;
    const scoreObj = detail.scores.find((s) => s.performanceCriteriaId === criteriaId);
    return scoreObj ? scoreObj.score : 0;
  };

  const handleScoreChange = (criteriaId: number, value: number) => {
    setEditedScores((prev) => ({
      ...prev,
      [criteriaId]: value,
    }));
  };

  const handleSave = async () => {
    if (!detail) return;

    try {
      setIsSaving(true);

      const updatePromises = Object.entries(editedScores).map(async ([criteriaId, newScore]) => {
        const scoreRecord = detail.scores?.find(
          (s) => s.performanceCriteriaId === parseInt(criteriaId)
        );

        if (scoreRecord) {
          // Update existing score
          await performanceDetailScoreService.update(scoreRecord.id, {
            performanceCriteriaId: parseInt(criteriaId),
            score: newScore
          });
        } else {
          // Create new score if it doesn't exist
          await performanceDetailScoreService.create({
            performanceReportDetailId: detail.id,
            performanceCriteriaId: parseInt(criteriaId),
            score: newScore
          });
        }
      });

      await Promise.all(updatePromises);

      toast.success("Cập nhật đánh giá thành công!");
      onOpenChange(false);

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

  const calculateAverageScore = (): number => {
    const scores = Object.values(editedScores);
    if (scores.length === 0) return 0;
    return scores.reduce((sum, s) => sum + s, 0) / scores.length;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 4) return "green";
    if (score >= 3) return "blue";
    if (score >= 2) return "orange";
    return "red";
  };

  if (!detail) return null;

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <StarOutlined className="text-blue-600 text-lg" />
          </div>
          <div>
            <Title level={5} className="!mb-0">
              Báo cáo #{String(detail.performanceReportId).padStart(3, "0")}
            </Title>
            <Text type="secondary" className="text-xs">
              Chi tiết đánh giá hiệu suất làm việc
            </Text>
          </div>
        </div>
      }
      open={open}
      onCancel={() => onOpenChange(false)}
      width={700}
      centered
      footer={[
        <Button key="cancel" onClick={() => onOpenChange(false)} disabled={isSaving}>
          Đóng
        </Button>,
        <Button key="save" type="primary" onClick={handleSave} loading={isSaving}>
          Lưu thay đổi
        </Button>,
      ]}
    >
      <Spin spinning={isLoading}>
        <div className="space-y-5 py-2">
          {/* Employee Info Card */}
          <Card size="small" className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
            <div className="flex items-center gap-3">
              <Avatar
                size={56}
                src={detail.employee?.avatar || defaultAvatar}
                icon={<UserOutlined />}
                className="border-2 border-white shadow-md"
              />
              <div className="flex-1">
                <Text strong className="text-base block">
                  {detail.employee?.fullName || "N/A"}
                </Text>
                <Text type="secondary" className="text-sm block">
                  {detail.employee?.email || ""}
                </Text>
                {detail.employee?.employeeCode && (
                  <Tag color="blue" className="mt-1">
                    Mã NV: {detail.employee.employeeCode}
                  </Tag>
                )}
              </div>
            </div>
          </Card>

          <Divider className="!my-3">
            <span className="text-gray-500 text-sm flex items-center gap-2">
              <StarOutlined /> Tiêu chí đánh giá
            </span>
          </Divider>

          {/* Criteria Grid */}
          <div className="grid grid-cols-2 gap-4">
            {criteria.map((criterion) => {
              const score = getScoreByCriteriaId(criterion.id);
              return (
                <Card
                  key={criterion.id}
                  size="small"
                  className="hover:shadow-md transition-shadow"
                  styles={{ body: { padding: "16px" } }}
                >
                  <Text strong className="block mb-2 text-gray-700">
                    {criterion.name}
                  </Text>
                  {criterion.description && (
                    <Text type="secondary" className="block text-xs mb-3 leading-relaxed">
                      {criterion.description}
                    </Text>
                  )}
                  <div className="flex items-center justify-between">
                    <Rate
                      value={score}
                      onChange={(value) => handleScoreChange(criterion.id, value)}
                      className="text-base"
                    />
                    <Tag color={getScoreColor(score)} className="ml-2">
                      {score}/5
                    </Tag>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Average Score Card */}
          {Object.keys(editedScores).length > 0 && (
            <Card
              size="small"
              className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <TrophyOutlined className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <Text type="secondary" className="text-xs block">
                      Điểm trung bình chung
                    </Text>
                    <Title level={4} className="!mb-0" style={{ color: getScoreColor(calculateAverageScore()) }}>
                      {calculateAverageScore().toFixed(1)}
                      <Text type="secondary" className="text-sm font-normal"> / 5</Text>
                    </Title>
                  </div>
                </div>
                <Rate
                  disabled
                  value={Math.round(calculateAverageScore())}
                  className="text-lg"
                />
              </div>
            </Card>
          )}
        </div>
      </Spin>
    </Modal>
  );
}
