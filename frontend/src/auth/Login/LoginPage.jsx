import { useLoginMutation } from "@/redux/features/auth/authApiSlice";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { Button, Flex, Form, Input, Typography } from "antd";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  const onFinish = async (e) => {
    const userLogin = {
      user_phoneNumber: e.user_phoneNumber,
      user_password: e.user_password,
    };
    try {
      const { accessToken } = await login(userLogin).unwrap();
      dispatch(setCredentials({ accessToken }));
      toast.success("Đăng nhập thành công");
      navigate("/");
    } catch (error) {
      toast.error("Đăng nhập thất bại");
    }
  };

  return (
    <Flex vertical="true" justify="center" align="stretch">
      <Typography.Title level={3} className="font-mono">
        Vui chào đón ba mẹ
      </Typography.Title>
      <Typography.Text className="font-mono">
        Đăng nhập hoặc
        <Typography.Link
          onClick={() => navigate("/register")}
          className="mx-2 font-mono"
        >
          Đăng ký
        </Typography.Link>
        ngay tài khoản
      </Typography.Text>
      <Form
        name="normal_login"
        className="login-form w-full mt-6"
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item label="Số điện thoại">
          <Form.Item
            name="user_phoneNumber"
            rules={[
              {
                required: true,
                message: "Mời ba mẹ nhập số điện thoại",
              },
              {
                pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                message: "Mời ba mẹ nhập lại số điện thoại",
              },
            ]}
            noStyle
          >
            <Input
              placeholder="Ba mẹ nhập số điện thoại"
              onKeyDown={(event) => {
                const copyPress = event.ctrlKey && event.key === "C";
                const pastePress = event.ctrlKey && event.key === "V";
                if (
                  !(
                    /[0-9]/.test(event.key) ||
                    event.key === "Backspace" ||
                    event.key === "Enter" ||
                    event.key === "Tab" ||
                    copyPress ||
                    pastePress
                  )
                ) {
                  event.preventDefault();
                }
              }}
              maxLength={12}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item label="Mật khẩu" className="mb-2">
          <Form.Item
            name="user_password"
            rules={[
              {
                required: true,
                message: "Mời ba mẹ nhập mật khẩu",
              },
            ]}
            noStyle
          >
            <Input.Password
              placeholder="Ba mẹ nhập mật khẩu"
              iconRender={(visible) =>
                visible ? (
                  <Eye size={20} strokeWidth={1.15} />
                ) : (
                  <EyeOff size={20} strokeWidth={1.15} />
                )
              }
            />
          </Form.Item>
        </Form.Item>

        <Form.Item className="text-end">
          {/* <Form.Item name="remember" noStyle>
            <Checkbox
              defaultChecked={persist}
              value={persist}
              onChange={() => setPersist((prev) => !prev)}
            >
              Ghi nhớ đăng nhập
            </Checkbox>
          </Form.Item> */}

          <Typography.Link onClick={() => navigate("/forgot-password")}>
            Quên mật khẩu?
          </Typography.Link>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form w-full min-h-10"
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};
export default Login;
