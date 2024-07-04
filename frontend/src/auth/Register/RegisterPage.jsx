/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Checkbox, Flex, Form, Input, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpForm from "../components/otp-form";
import { useCheckPhoneExistedMutation } from "@/redux/features/users/usersApiSlice";
import { toast } from "sonner";

function Register() {
  // eslint-disable-next-line no-unused-vars
  const [field, setField] = useState({});
  const [show, setShow] = useState(false);
  const [registerInfo, setRegisterInfo] = useState();
  const navigate = useNavigate();
  const [checkPhoneExisted, { isLoading, isError, isSuccess, error }] =
    useCheckPhoneExistedMutation();

  const onFinish = async (e) => {
    setRegisterInfo({
      user_phoneNumber: e.user_phoneNumber,
      user_password: e.user_password,
    });
    if (!isLoading) {
      await checkPhoneExisted({
        user_phoneNumber: e.user_phoneNumber,
      }).unwrap();
    }
  };

  useEffect(() => {
    if (isError) {
      console.log(error.data.message);
      toast.error("Số điện thoại này đã tồn tại");
    } else if (isSuccess) {
      setShow((show) => !show);
    }
  }, [isError, isSuccess]);

  return show ? (
    <OtpForm
      registerInfo={registerInfo}
      message="Đăng ký thành công"
      path="register"
    />
  ) : (
    <Flex vertical="true" justify="center" align="stretch">
      <Typography.Title level={3} className="font-mono">
        Vui chào đón ba mẹ
      </Typography.Title>
      <Typography.Text className="font-mono">
        <Typography.Link
          onClick={() => navigate("/login")}
          className="mr-2 font-mono"
        >
          Đăng nhập
        </Typography.Link>
        hoặc Đăng ký ngay tài khoản
      </Typography.Text>
      <Form
        name="normal_login"
        className="login-form w-full mt-6"
        layout="vertical"
        fields={field}
        onFinish={onFinish}
      >
        <Form.Item
          name="user_phoneNumber"
          label="Số điện thoại"
          hasFeedback
          validateDebounce={1000}
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
        >
          <Input
            placeholder="Ba mẹ nhập số điện thoại"
            value={field?.phone}
            onKeyDown={(event) => {
              if (
                !(
                  /[0-9]/.test(event.key) ||
                  event.key === "Backspace" ||
                  event.key === "Enter" ||
                  event.key === "Tab"
                )
              ) {
                event.preventDefault();
              }
            }}
            maxLength={12}
          />
        </Form.Item>

        <Form.Item
          name="user_password"
          label="Mật khẩu"
          hasFeedback
          validateDebounce={1000}
          rules={[
            {
              required: true,
              message: "Mời ba mẹ nhập mật khẩu",
            },
            {
              min: 6,
              message: "Mật khẩu có độ dài ít nhất là 6 ký tự",
            },
            {
              pattern: /[a-z]/g,
              message: "Mật khẩu phải bao gồm chữ cái thường a-z",
            },
            {
              pattern: /[A-Z]/g,
              message: "Mật khẩu phải bao gồm chữ cái hoa A-Z",
            },
            {
              pattern: /[0-9]/g,
              message: "Mật khẩu phải bao gồm chữ cái hoa A-Z",
            },
          ]}
        >
          <Input.Password placeholder="Ba mẹ nhập mật khẩu" />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Nhập lại mật khẩu"
          dependencies={["user_password"]}
          hasFeedback
          validateDebounce={1000}
          rules={[
            {
              required: true,
              message: "Xác nhận lại mật khẩu",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("user_password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    "Mật khẩu bạn vừa nhập không khớp với mật khẩu phía trên"
                  )
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Ba mẹ nhập lại mật khẩu" />
        </Form.Item>

        <Form.Item
          name="checked"
          valuePropName="checked"
          rules={[
            () => ({
              validator(_, value) {
                if (value === true) {
                  return Promise.resolve();
                }
                return Promise.reject();
              },
            }),
          ]}
        >
          <Checkbox className="h-fit">
            <Typography.Paragraph className="font-mono text-xs pt-3">
              Ba mẹ đã đọc và đồng ý với{" "}
              <Typography.Link className="font-mono text-xs">
                Điều Khoản Chung
              </Typography.Link>{" "}
              &{" "}
              <Typography.Link className="font-mono text-xs">
                {" "}
                Chính Sách Bảo Mật
              </Typography.Link>{" "}
              của ConYeu.com
            </Typography.Paragraph>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form w-full min-h-10"
          >
            Tiếp tục
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
}

export default Register;
