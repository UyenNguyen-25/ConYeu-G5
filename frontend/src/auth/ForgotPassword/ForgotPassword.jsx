import { Button, Flex, Form, Input, Typography } from "antd";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import OtpForm from "../components/otp-form";
import { useCheckPhoneExistedMutation } from "@/redux/features/users/usersApiSlice";

const ForgotPassword = () => {
  // eslint-disable-next-line no-unused-vars
  const [field, setField] = useState();
  const [show, setShow] = useState(false);
  const [registerInfo, setRegisterInfo] = useState();
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
      toast.success("Mã OTP đang được gửi tới số điện thoại");
      setShow((show) => !show);
    } else if (isSuccess) {
      toast.error("Số điện thoại này không tồn tại");
    }
  }, [isError, isSuccess, error]);

  return show ? (
    <OtpForm
      registerInfo={registerInfo}
      message="Thay đổi mật khẩu thành công"
      path="forgot-pass"
    />
  ) : (
    <Flex vertical="true" justify="center" align="stretch">
      <Typography.Title level={3} className="font-mono">
        Quên mật khẩu
      </Typography.Title>
      <Form
        name="normal_login"
        className="login-form w-full mt-6"
        layout="vertical"
        fields={field}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="user_phoneNumber"
          label="Số điện thoại"
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
              const copyPress = event.ctrlKey && event.key === "c";
              const pastePress = event.ctrlKey && event.key === "v";
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
              min: 8,
              message: "Mật khẩu có độ dài ít nhất là 8 ký tự",
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
};
export default ForgotPassword;
