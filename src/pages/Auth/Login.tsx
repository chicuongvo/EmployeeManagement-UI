import { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signIn } from "@/apis/auth/login";
import { useUser } from "@/hooks/useUser";
import type { SignInRequest } from "@/apis/auth/login";

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUserChanged } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectUrl = searchParams.get("redirect_url") || "/employee/employees";

  const onFinish = async (values: SignInRequest) => {
    setLoading(true);
    setError(null);

    try {
      await signIn(values);
      message.success("Đăng nhập thành công!");

      // Small delay to ensure cookie is set before fetching profile
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Trigger user profile refresh

      setUserChanged(true);

      // Redirect to original page or dashboard
      navigate(redirectUrl, { replace: true });
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
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
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          borderRadius: "12px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 8, color: "#306e51" }}>
            Employee Management
          </Title>
          <Text type="secondary">Đăng nhập vào hệ thống</Text>
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

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="employeeCode"
            label="Mã nhân viên"
            rules={[
              { required: true, message: "Vui lòng nhập mã nhân viên" },
              { min: 3, message: "Mã nhân viên phải có ít nhất 3 ký tự" },
              {
                pattern: /^[a-zA-ZÀ-ỹ0-9]+$/,
                message: "Mã nhân viên chỉ được chứa chữ cái và số",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Nhập mã nhân viên"
              autoFocus
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Nhập mật khẩu"
              onPressEnter={() => form.submit()}
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
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Mật khẩu mặc định: <strong>123456</strong>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;
