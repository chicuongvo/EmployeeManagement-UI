import { useState, useEffect } from "react";
import {
  Modal,
  List,
  Input,
  Button,
  Avatar,
  message,
  Popconfirm,
  Space,
  Empty,
  Spin,
  Divider,
  Tag,
  Descriptions,
} from "antd";
import {
  UserOutlined,
  SendOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  FlagOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import type { Task } from "@/apis/task";
import {
  getTaskComments,
  createTaskComment,
  updateTaskComment,
  deleteTaskComment,
  type TaskComment,
} from "@/apis/task";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { TextArea } = Input;

interface TaskCommentsModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  currentUserId: number;
}

const TaskCommentsModal = ({
  task,
  open,
  onClose,
  currentUserId,
}: TaskCommentsModalProps) => {
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  // Fetch comments
  const fetchComments = async () => {
    if (!task) return;

    setLoading(true);
    try {
      const response = await getTaskComments(task.id);
      setComments(response.data || []);
    } catch (error) {
      message.error("Không thể tải comments");
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && task) {
      fetchComments();
    }
  }, [open, task]);

  // Create comment
  const handleSubmit = async () => {
    if (!newComment.trim() || !task) return;

    setSubmitting(true);
    try {
      await createTaskComment(task.id, { content: newComment });
      message.success("Đã thêm comment");
      setNewComment("");
      fetchComments();
    } catch (error) {
      message.error("Không thể thêm comment");
      console.error("Error creating comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Update comment
  const handleUpdate = async (commentId: number) => {
    if (!editContent.trim()) return;

    try {
      await updateTaskComment(commentId, { content: editContent });
      message.success("Đã cập nhật comment");
      setEditingId(null);
      setEditContent("");
      fetchComments();
    } catch (error) {
      message.error("Không thể cập nhật comment");
      console.error("Error updating comment:", error);
    }
  };

  // Delete comment
  const handleDelete = async (commentId: number) => {
    try {
      await deleteTaskComment(commentId);
      message.success("Đã xóa comment");
      fetchComments();
    } catch (error) {
      message.error("Không thể xóa comment");
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <Modal
      title={`Thảo luận: ${task?.name || ""}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      <div className="flex flex-col h-[600px]">
        {/* Task Information Section */}
        {task && (
          <div className="mb-4 pb-4 border-b">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Tiêu đề">
                <span className="font-semibold">{task.name}</span>
              </Descriptions.Item>
              {task.description && (
                <Descriptions.Item label="Mô tả">
                  <div className="text-gray-700">{task.description}</div>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    task.status === "DONE"
                      ? "green"
                      : task.status === "IN_PROGRESS"
                        ? "blue"
                        : task.status === "IN_REVIEW"
                          ? "orange"
                          : "default"
                  }
                >
                  {task.status === "TODO"
                    ? "Chờ làm"
                    : task.status === "IN_PROGRESS"
                      ? "Đang làm"
                      : task.status === "IN_REVIEW"
                        ? "Đang review"
                        : task.status === "DONE"
                          ? "Hoàn thành"
                          : "Đã hủy"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Độ ưu tiên">
                <Tag
                  icon={<FlagOutlined />}
                  color={
                    task.priority === "CRITICAL"
                      ? "red"
                      : task.priority === "HIGH"
                        ? "orange"
                        : task.priority === "MEDIUM"
                          ? "blue"
                          : "default"
                  }
                >
                  {task.priority === "LOW"
                    ? "Thấp"
                    : task.priority === "MEDIUM"
                      ? "Trung bình"
                      : task.priority === "HIGH"
                        ? "Cao"
                        : "Rất cao"}
                </Tag>
              </Descriptions.Item>
              {(task.startDate || task.dueDate) && (
                <Descriptions.Item label="Thời gian">
                  <Space size="small">
                    <CalendarOutlined />
                    <span>
                      {task.startDate &&
                        dayjs(task.startDate).format("DD/MM/YYYY")}
                      {task.startDate && task.dueDate && " - "}
                      {task.dueDate && dayjs(task.dueDate).format("DD/MM/YYYY")}
                    </span>
                  </Space>
                </Descriptions.Item>
              )}
              {task.assignments && task.assignments.length > 0 && (
                <Descriptions.Item label="Người thực hiện">
                  <Space size="small" wrap>
                    {task.assignments.map((assignment) => (
                      <Tag
                        key={assignment.id}
                        icon={
                          <Avatar
                            src={assignment.employee.avatar}
                            size="small"
                            className="mr-1"
                          />
                        }
                      >
                        {assignment.employee.fullName}
                      </Tag>
                    ))}
                  </Space>
                </Descriptions.Item>
              )}
            </Descriptions>
            <Divider className="my-3" />
          </div>
        )}

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto mb-4 pr-2">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Spin size="large" />
            </div>
          ) : comments.length === 0 ? (
            <Empty description="Chưa có comment nào" />
          ) : (
            <List
              dataSource={comments}
              renderItem={(comment) => (
                <List.Item key={comment.id} className="!border-b-0">
                  <div className="w-full">
                    <div className="flex items-start gap-3">
                      <Avatar
                        src={comment.employee.avatar}
                        icon={<UserOutlined />}
                        size="large"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="font-semibold">
                              {comment.employee.fullName}
                            </span>
                            <span className="text-gray-500 text-xs ml-2">
                              {dayjs(comment.createdAt).fromNow()}
                            </span>
                          </div>
                          {comment.employeeId === currentUserId && (
                            <Space>
                              <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => {
                                  setEditingId(comment.id);
                                  setEditContent(comment.content);
                                }}
                              />
                              <Popconfirm
                                title="Xóa comment này?"
                                onConfirm={() => handleDelete(comment.id)}
                                okText="Xóa"
                                cancelText="Hủy"
                              >
                                <Button
                                  type="text"
                                  size="small"
                                  danger
                                  icon={<DeleteOutlined />}
                                />
                              </Popconfirm>
                            </Space>
                          )}
                        </div>
                        {editingId === comment.id ? (
                          <div className="mt-2">
                            <TextArea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              rows={3}
                              className="mb-2"
                            />
                            <Space>
                              <Button
                                size="small"
                                type="primary"
                                onClick={() => handleUpdate(comment.id)}
                              >
                                Lưu
                              </Button>
                              <Button
                                size="small"
                                onClick={() => {
                                  setEditingId(null);
                                  setEditContent("");
                                }}
                              >
                                Hủy
                              </Button>
                            </Space>
                          </div>
                        ) : (
                          <div className="text-gray-700 whitespace-pre-wrap">
                            {comment.content}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}
        </div>

        {/* New Comment Input */}
        <div className="border-t pt-4">
          <TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết comment..."
            rows={3}
            onPressEnter={(e) => {
              if (e.ctrlKey) {
                handleSubmit();
              }
            }}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">Ctrl + Enter để gửi</span>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmit}
              loading={submitting}
              disabled={!newComment.trim()}
            >
              Gửi
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskCommentsModal;
