/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Flex, Form, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import { signInWithPhoneNumber } from "firebase/auth";
import auth from "../firebase/setup";
import { Otptimer } from "otp-timer-ts";
import { toast } from "sonner";
import {
  useSignupMutation,
} from "@/redux/features/auth/authApiSlice";

function OtpForm(props) {
  const { registerInfo, message, path } = props;
  const [form] = useForm();
  const [otp, setOtp] = useState("");
  const [signup] = useSignupMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    const appVerifier = window.recaptchaVerifier;
    const user_phoneNumber = registerInfo?.user_phoneNumber.replace(0, "+84");
    console.log("user_phoneNumber", user_phoneNumber);

    await signInWithPhoneNumber(auth, user_phoneNumber, appVerifier)
      .then((confirmation) => {
        // console.log(confirmation);
        window.confirmationResult = confirmation;
        toast.success("Mã OTP đang được gửi tới số điện thoại");
      })
      .catch((err) => console.log(err));
  }

  const onFinish = async () => {
    setIsSuccess(true);
    window.confirmationResult
      .confirm(otp)
      .then(async () => {
        try {
          path.includes("register")
            && await signup(registerInfo).unwrap()
          setIsSuccess(true);
        } catch (error) {
          console.log(error);
        }
        await auth.signOut();
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        console.log(error);
        setErrorMessage(error);
      });
  };

  useEffect(() => {
    sendOtp()
  }, [])

  useEffect(() => {
    if (errorMessage.length > 0) {
      toast.error("Đã xảy ra lỗi");
    }
    if (isSuccess === true && path.includes("register")) {
      toast.success(message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else if (isSuccess === true && !path.includes("register")) {
      console.log(registerInfo);
      toast.success(message);
      setTimeout(() => {
        navigate("/set-new-password", { state: registerInfo });
      }, 2000);
    }
  }, [isSuccess, errorMessage, navigate]);

  return (
    <Flex vertical="true" align="center" justify="center" gap={10}>
      <Typography.Title level={3}>Nhập mã xác thực</Typography.Title>
      <Typography>
        Nhập mã xác thực (4 chữ số) đang gửi đến số điện thoại
      </Typography>
      <Typography.Title level={3}>
        {registerInfo?.user_phoneNumber}
      </Typography.Title>
      <Form
        form={form}
        autoComplete="off"
        onFinish={onFinish}
        className="w-full h-full flex flex-col mt-6 gap-5"
      >
        <FormItem name="otp" className="w-fit mx-auto">
          <OTPInput
            containerStyle={{
              fontSize: 30,
            }}
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span>-</span>}
            renderInput={(props) => (
              <input
                {...props}
                onKeyDown={(event) => {
                  if (
                    !(
                      /[0-9]/.test(event.key) ||
                      event.key === "Backspace" ||
                      event.key === "Enter"
                    )
                  ) {
                    event.preventDefault();
                  }
                }}
              />
            )}
          />
        </FormItem>
        <FormItem>
          <FormItem>
            <Otptimer
              minutes={0}
              seconds={30}
              text="Gửi lại mã OTP hiệu lực sau"
              textStyle={{ color: "#8B8B8B" }}
              buttonText={<Typography.Link>Gửi lại mã OTP</Typography.Link>}
              onResend={sendOtp}
            />
          </FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full min-h-10"
            disabled={otp === "" || otp.length < 6 ? true : false}
          >
            Đăng ký
          </Button>
        </FormItem>
      </Form>
    </Flex>
  );
}

export default OtpForm;
