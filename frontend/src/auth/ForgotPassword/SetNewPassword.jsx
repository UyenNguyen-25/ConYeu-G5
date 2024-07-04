import { Button, Flex, Form, Input, Typography } from "antd";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApiSlice";

const SetNewPassword = () => {
    // eslint-disable-next-line no-unused-vars
    const [field, setField] = useState();
    const location = useLocation()
    const data = location.state
    const [forgotPassword, { isError, error, isSuccess }] = useForgotPasswordMutation();
    const navigate = useNavigate()

    const onFinish = async (e) => {
        try {
            const newData = { user_phoneNumber: data?.user_phoneNumber, user_password: e?.user_password }
            // console.log(newData);
            await forgotPassword(newData).unwrap();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (isError) {
            console.log(error.data.message);
            toast.error("Cài đặt mật khẩu mới thất bại");
        } else if (isSuccess) {
            toast.success("Cài đặt mật khẩu mới thành công");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        }
    }, [isError, isSuccess, error, navigate]);

    return data ? (
        <Flex vertical="true" justify="center" align="stretch">
            <Typography.Title level={3} className="font-mono">
                Nhập mật khẩu mới
            </Typography.Title>
            <Form
                className="login-form w-full mt-6"
                layout="vertical"
                fields={field}
                onFinish={onFinish}
            >
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

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form w-full min-h-10"
                    >
                        Hoàn tất
                    </Button>
                </Form.Item>
            </Form>
        </Flex>)
        : <Navigate to={"/login"}></Navigate>

};
export default SetNewPassword;
