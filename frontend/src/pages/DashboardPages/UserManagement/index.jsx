import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Input,
  Popover,
  Menu,
  Dropdown,
  Modal,
  Form,
  Radio,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EllipsisOutlined,
  DownOutlined,
} from "@ant-design/icons";
import {
  useAddNewUserMutation,
  useGetUsersQuery,
} from "@/redux/features/users/usersApiSlice";
import { toast } from "sonner";

const { Search } = Input;

const UserManagement = () => {
  const [form] = Form.useForm();
  // eslint-disable-next-line no-unused-vars
  const { data: users } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const onFinish = async (e) => {
    const newUser = {
      user_fullname: e?.user_fullname,
      user_phoneNumber: e?.user_phoneNumber,
      user_password: e?.user_password ? e?.user_password : "123456",
      user_email: e?.user_email,
      user_role: e?.user_role,
    };
    if (!isLoading) {
      await addNewUser(newUser);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Create User Success");
      form.resetFields();
    }
    isError && toast.error(error?.data.message);
  }, [isSuccess, isError, error, form]);

  const [data, setData] = useState([
    {
      key: "1",
      no: "1",
      name: "Lu Ai Dao",
      phone: "0123 456 789",
      dateCreated: "16/05/2024",
      role: "Manager",
      status: "Active",
    },
    {
      key: "2",
      no: "2",
      name: "Nguyen Van B",
      phone: "0987 654 321",
      dateCreated: "16/05/2024",
      role: "Staff",
      status: "Inactive",
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleMenuClick = (e, record) => {
    const { key } = e;
    const newData = data.map((item) => {
      if (item.key === record.key) {
        return {
          ...item,
          role: key.charAt(0).toUpperCase() + key.slice(1),
        };
      }
      return item;
    });

    setData(newData);
  };

  const changeRoleMenu = (record) => (
    <Menu>
      <Menu.Item key="manager" onClick={(e) => handleMenuClick(e, record)}>
        Manager
      </Menu.Item>
      <Menu.Item key="staff" onClick={(e) => handleMenuClick(e, record)}>
        Staff
      </Menu.Item>
    </Menu>
  );

  const popoverContent = (record) => (
    <Menu>
      <Menu.Item key="changeRole">
        <Dropdown overlay={changeRoleMenu(record)} trigger={["click"]}>
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            Change role <DownOutlined />
          </a>
        </Dropdown>
      </Menu.Item>
      <Menu.Item key="changeStatus">Change status</Menu.Item>
      <Menu.Item key="delete">Delete</Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Date created",
      dataIndex: "dateCreated",
      key: "dateCreated",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "Manager", value: "Manager" },
        { text: "Staff", value: "Staff" },
      ],
      onFilter: (value, record) => record.role.indexOf(value) === 0,
      sorter: (a, b) => {
        const roles = ["Manager", "Staff"];
        return roles.indexOf(a.role) - roles.indexOf(b.role);
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Popover content={() => popoverContent(record)} placement="right">
          <Button icon={<EllipsisOutlined />} />
        </Popover>
      ),
    },
  ];

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="flex justify-between items-center mb-4">
        <Search
          placeholder="Search by..."
          enterButton={<SearchOutlined />}
          className="w-1/3"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="ml-2"
          onClick={showModal}
        >
          Add Employee
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ position: ["bottomCenter"] }}
        className="rounded-lg shadow"
      />

      <Modal
        title="Create Account"
        visible={isModalVisible}
        onOk={form.submit}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="user_fullname"
            label="Full Name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input placeholder="Please enter full name" />
          </Form.Item>
          <Form.Item
            name="user_phoneNumber"
            label="Phone Number"
            hasFeedback
            validateDebounce={1000}
            rules={[
              {
                required: true,
                message: "Mời nhập số điện thoại",
              },
              {
                pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                message: "Mời nhập lại số điện thoại",
              },
            ]}
          >
            <Input
              placeholder="Please input phone number"
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

          <Form.Item name="user_email" label="Email">
            <Input placeholder="Please input email" />
          </Form.Item>
          <Form.Item name="user_password" label="Password">
            <Input.Password defaultValue="123456" />
          </Form.Item>
          <Form.Item
            name="user_role"
            label="Role"
            rules={[{ required: true, message: "Please select role" }]}
          >
            <Radio.Group>
              <Radio.Button value="Manager">Manager</Radio.Button>
              <Radio.Button value="Staff">Staff</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserManagement;
