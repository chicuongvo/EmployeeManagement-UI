import { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Alert, Divider } from "antd";
import { LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { changePassword } from "@/apis/auth/changePassword";
import { ROUTER_DASHBOARD } from "@/routes";

const { Title, Text } = Typography;

const ChangePassword = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const onFinish = async (values: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        if (values.newPassword !== values.confirmPassword) {
            setError("Mật khẩu mới xác nhận không khớp!");
            message.error("Mật khẩu mới xác nhận không khớp!");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword,
            });

            setSuccess(true);
            message.success(response.message || "Đổi mật khẩu thành công!");
            form.resetFields();
            
            setTimeout(() => {
                navigate(ROUTER_DASHBOARD, { replace: true });
            }, 1500);
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Đổi mật khẩu thất bại. Vui lòng thử lại.";
            setError(errorMessage);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f0f2f5",
                padding: "20px",
            }}
        >
            <Card
                style={{
                    width: "100%",
                    maxWidth: 450,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    borderRadius: "12px",
                }}
            >
                <div style={{ marginBottom: 24 }}>
                    <button
                        onClick={() => navigate(ROUTER_DASHBOARD)}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#306e51",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 14,
                            fontWeight: 500,
                            padding: 0,
                        }}
                    >
                        <ArrowLeftOutlined /> Quay lại
                    </button>
                </div>

                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <Title level={2} style={{ marginBottom: 8, color: "#306e51" }}>
                        Đổi Mật Khẩu
                    </Title>
                    <Text type="secondary">
                        Cập nhật mật khẩu của bạn để bảo vệ tài khoản
                    </Text>
                </div>

                {error && (
                    <Alert
                        message={error}
                        type="error"
                        showIcon
                        closable
                        onClose={() => setError(null)}
                        style={{ marginBottom: 24 }}
                    />
                )}

                {success && (
                    <Alert
                        message="Đổi mật khẩu thành công!"
                        description="Bạn sẽ được chuyển hướng trong giây lát..."
                        type="success"
                        showIcon
                        style={{ marginBottom: 24 }}
                    />
                )}

                <Form
                    form={form}
                    name="changePassword"
                    onFinish={onFinish}
                    layout="vertical"
                    autoComplete="off"
                    size="large"
                    disabled={success}
                >
                    <Form.Item
                        name="currentPassword"
                        label="Mật khẩu hiện tại"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
                            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                            placeholder="Nhập mật khẩu hiện tại"
                            autoFocus
                        />
                    </Form.Item>

                    <Divider style={{ margin: "16px 0" }} />

                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu mới" },
                            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                            {
                                validator: (_, value) => {
                                    const currentPassword = form.getFieldValue("currentPassword");
                                    if (currentPassword && value === currentPassword) {
                                        return Promise.reject(
                                            new Error("Mật khẩu mới phải khác với mật khẩu hiện tại")
                                        );
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                            placeholder="Nhập mật khẩu mới"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu mới"
                        rules={[
                            { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
                            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                            {
                                validator: (_, value) => {
                                    const newPassword = form.getFieldValue("newPassword");
                                    if (newPassword && value !== newPassword) {
                                        return Promise.reject(
                                            new Error("Xác nhận mật khẩu không khớp")
                                        );
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                            placeholder="Xác nhận mật khẩu mới"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            style={{
                                height: 44,
                                fontSize: 16,
                                fontWeight: 500,
                                background: "#306e51",
                                borderColor: "#306e51",
                            }}
                        >
                            {loading ? "Đang xử lý..." : "Đổi Mật Khẩu"}
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ marginTop: 24, textAlign: "center" }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Cần hỗ trợ?{" "}
                        <a href="mailto:support@example.com" style={{ color: "#306e51" }}>
                            Liên hệ với chúng tôi
                        </a>
                    </Text>
                </div>
            </Card>
        </div>
    );
};

export default ChangePassword;
