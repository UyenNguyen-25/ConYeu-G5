/* eslint-disable react-hooks/exhaustive-deps */
import { selectCurrentUser } from "@/redux/features/auth/authSlice"
import { useGetUserQuery, useUpdateUserMutation } from "@/redux/features/users/usersApiSlice"
import { Button, Form, Input, Popconfirm, Skeleton, Typography } from "antd"
import { useForm } from "antd/es/form/Form"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "sonner"

const Profile = () => {
    const user = useSelector(selectCurrentUser)
    const { data: userDetail, isLoading, refetch } = useGetUserQuery({ user_phoneNumber: user?.user_phoneNumber }, {
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })
    const [form] = useForm()
    const [show, setShow] = useState(true)
    const [updateUser, { isSuccess, isError, error }] = useUpdateUserMutation()

    const onFinish = async () => {
        try {
            const values = await form.validateFields()
            const newData = { ...values, ...userDetail, user_role: user.user_role.role_description }
            // console.log(newData);
            await updateUser(newData).unwrap()
        } catch (error) {
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại")
            console.log(error);
        }
    }

    const cancel = () => {
        setShow(true);
    };

    useEffect(() => {
        if (isError) {
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại")
            console.log(error.data.message);
        }
        if (isSuccess) {
            toast.success("Cập nhật thông tin cá nhân thành công")
            refetch()
            setShow(true)
        }
    }, [error, isError, isSuccess])

    return (
        <div className="bg-white min-w-[500px] max-w-[450px] p-6 pb-2 my-16 m-auto rounded-lg">
            <Typography.Title level={3}>Thông tin tài khoản</Typography.Title>
            {isLoading ? <Skeleton /> :
                userDetail ?
                    show ?
                        <>
                            <Form
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 16 }}>

                                <Form.Item label="Họ và Tên" className="font-bold">
                                    <div className="font-light ml-5">{userDetail.user_fullname}</div>
                                </Form.Item>

                                <Form.Item label="Số điện thoại" className="font-bold">
                                    <div className="font-light ml-5">{userDetail.user_phoneNumber}</div>
                                </Form.Item>

                                <Form.Item label="Địa chỉ" className="font-bold">
                                    <div className="font-light ml-5">{userDetail.address_id.address_line1}</div>
                                </Form.Item>
                            </Form>

                            <Button onClick={() => setShow(false)}>
                                Update
                            </Button>
                        </>
                        :
                        <Form form={form}
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 16 }}
                            initialValues={
                                { user_id: userDetail._id, user_fullname: userDetail.user_fullname, user_phoneNumber: userDetail.user_phoneNumber, address: userDetail.address_id.address_line1, isDefault: true }
                            }>

                            <Form.Item name={"user_id"} noStyle>
                                <Input hidden></Input>
                            </Form.Item>

                            <Form.Item label="Số điện thoại" name={"user_phoneNumber"}
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
                                <Input className="ml-5" onKeyDown={(event) => {
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
                                    maxLength={12} disabled>

                                </Input>
                            </Form.Item>

                            <Form.Item label="Họ và Tên" name={"user_fullname"}
                                rules={[
                                    {
                                        required: true,
                                        message: "Mời ba mẹ nhập họ và tên",
                                    }

                                ]}

                            >
                                <Input className="ml-5"></Input>
                            </Form.Item>

                            <Form.Item label="Địa chỉ" name={"address"}
                                rules={[
                                    {
                                        required: true,
                                        message: "Mời ba mẹ nhập địa chỉ",
                                    }
                                ]}
                            >
                                <Input className="ml-5"></Input>
                            </Form.Item>

                            <Form.Item >
                                <Button type="primary" className="mr-6" onClick={onFinish}>
                                    Save
                                </Button>
                                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                                    <Typography.Link type="danger">Cancel</Typography.Link>
                                </Popconfirm>
                            </Form.Item>

                        </Form>
                    : <><Skeleton /></>
            }
        </div>
    )
}

export default Profile