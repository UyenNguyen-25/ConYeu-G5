/* eslint-disable react-hooks/exhaustive-deps */
import { useDeleteUserMutation, useUpdateUserMutation } from "@/redux/features/users/usersApiSlice";
import { Form, Input, Popconfirm, Select, Table, Tag, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ROLE_OPTION = [

  {
    value: "manager",
    label: "MANAGER",
  },
  {
    value: "staff",
    label: "STAFF",
  },
];

const STATUS_OPTION = [
  {
    value: "true",
    label: "Active",
  },
  {
    value: "false",
    label: "Inactive",
  },
];

export const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  index,
  options,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === "number" ? (
      <Input
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
      />
    ) : inputType === "text" ? (
      <Input />
    ) : (
      <Select options={options} />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          key={index}
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
            inputType === "number" && {
              pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const CustomTable = ({ list, Loading, employeeBtn, role, refetch, currentUser }) => {
  const [form] = useForm();
  const [data, setData] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    total: list?.length,
  });
  const [updateUser, { isError: isUpdateError, error: updateMsg, isSuccess: isUpdateSuccess }] = useUpdateUserMutation()
  const [deleteUser, { isError: isDeleteError, error: deleteMsg, isSuccess: isDeleteSuccess }] = useDeleteUserMutation()

  //edit
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record._id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record._id);
  };

  const handleDelete = async (key) => {
    await deleteUser({ user_id: key }).unwrap()
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const updateData = { ...row, user_role: row.user_role || "customer", user_status: row.user_status === "true", user_id: key };
      console.log(updateData);
      await updateUser(updateData).unwrap()
      setTimeout(() => { setEditingKey("") }, 2000)
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  useEffect(() => {
    setData(list);
  }, [list]);

  useEffect(() => {
    if (isUpdateError) {
      toast.error(updateMsg.data.message)
    } else if (isUpdateSuccess) {
      refetch()
      toast.success("Update successfully")
    } else if (isDeleteError) {
      toast.error(deleteMsg.data.message)
    } else if (isDeleteSuccess) {
      refetch()
      toast.success("Delete successfully")
    }
  }, [deleteMsg, isDeleteError, isDeleteSuccess, isUpdateError, isUpdateSuccess, updateMsg])

  const columns = [
    {
      title: "No",
      dataIndex: "_id",
      hidden: true,
    },
    {
      title: "Full Name",
      dataIndex: "user_fullname",
      editable: employeeBtn && true,
    },
    {
      title: "Phone Number",
      dataIndex: "user_phoneNumber",
      editable: employeeBtn && true,
    },
    {
      title: "Date Created",
      dataIndex: "createdAt",
      render: (value) => format(new Date(value), "d/MM/yyy"),
    },
    {
      title: "Role",
      dataIndex: "user_role",
      render: (value) => value?.toUpperCase(),
      editable: employeeBtn,
    },
    {
      title: "Status",
      dataIndex: "user_status",
      render: (status) =>
        status === "true" ? (
          <>
            <Tag color="green">Active</Tag>
          </>
        ) : (
          <>
            <Tag color="volcano">Inactive</Tag>
          </>
        ),
      filters: [
        {
          text: "Active",
          value: true,
        },
        {
          text: "Inactive",
          value: false,
        },
      ],
      onFilter: (value, record) => record.user_status === value,
      editable: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      hidden: role !== "admin",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record._id)}
              style={{
                marginRight: 10,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== "" || record.user_phoneNumber === currentUser}
              onClick={() => edit(record)}
              style={{
                marginRight: 10,
              }}
            >
              Edit
            </Typography.Link>

            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record._id)} >
              <Typography.Link type="danger" disabled={editingKey !== "" || record.user_phoneNumber === currentUser}>Delete</Typography.Link>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => {
        return {
          record,
          inputType:
            col.dataIndex === "user_phoneNumber"
              ? "number"
              : col.dataIndex === "user_role" || col.dataIndex === "user_status"
                ? "other"
                : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
          options: col.dataIndex === "user_role" ? ROLE_OPTION : STATUS_OPTION,
        };
      },
    };
  });

  const handleTableChange = (pagination, filters) => {
    setTableParams({
      pagination,
      filters,
    });
    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        pagination={{
          ...tableParams,
          position: ["", "bottomCenter"],
          onChange: cancel,
        }}
        columns={mergedColumns}
        onChange={handleTableChange}
        rowClassName="editable-row"
        loading={Loading}
        expandable={{
          expandedRowRender: (record) => {
            const address = record?.address_id
            return <>
              <div className="w-full flex"><div className="w-1/5 font-semibold">Primary Address:</div><div className="w-1/2">{address?.address_line1.length > 0 ? address.address_line1 : "No data"}</div> </div>
              <div className="w-full flex"><div className="w-1/5 font-semibold">Secondary Address:</div><div className="w-1/2">{address?.address_line2.length > 0 ? address.address_line2 : "No data"}</div> </div>
            </>
          },
        }}
      />
    </Form>
  );
};

export default CustomTable;
