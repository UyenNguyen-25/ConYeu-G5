import { Button, Flex, Form, Input, Typography } from "antd";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import OtpForm from "../components/otp-form";
import { useCheckPhoneExistedMutation } from "@/redux/features/users/usersApiSlice";

const ForgotPassword = () => {
  // eslint-disable-next-line no-unused-vars
  const [field, setField] = useState();
  const [show, setShow] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState();
  const [checkPhoneExisted, { isLoading, isError, isSuccess, error }] =
    useCheckPhoneExistedMutation();

  const onFinish = async (e) => {
    setPhoneNumber({
      user_phoneNumber: e.user_phoneNumber,
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
      setShow((show) => !show);
    } else if (isSuccess) {
      toast.error("Số điện thoại này không tồn tại");
    }
  }, [isError, isSuccess, error]);

  return show ? (
    <OtpForm
      registerInfo={phoneNumber}
      message="Xác thực mã OTP thành công"
      path="forgot-pass"
    />
  ) : (
    <Flex vertical="true" justify="center" align="stretch">
      <Typography.Title level={3} className="font-mono">
        Nhập số thoại của bạn
      </Typography.Title>
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
