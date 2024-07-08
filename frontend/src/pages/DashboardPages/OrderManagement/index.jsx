import { useState } from "react";
import {
  Tag,
  Button,
  Input,
  DatePicker,
  Dropdown,
  Menu,
} from "antd";
import { SearchOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "tailwindcss/tailwind.css";
import CustomTable from "./table";

const { RangePicker } = DatePicker;

const initialData = [
  {
    key: "1",
    id: "#123456",
    name: "John Smith",
    address: "Quận 9, TP.HCM",
    date: "12.09.2019 - 12.53 PM",
    payment: "Cash",
    phone: "0123456789",
    price: "1.000.000 đ",
    status: "Rejected",
  },
  {
    key: "2",
    id: "#123457",
    name: "John Smith",
    address: "Quận 9, TP.HCM",
    date: "12.09.2019 - 12.53 PM",
    payment: "Cash",
    phone: "0123456789",
    price: "1.000.000 đ",
    status: "Completed",
  },
  {
    key: "3",
    id: "#123458",
    name: "John Smith",
    address: "Quận 9, TP.HCM",
    date: "12.09.2019 - 12.53 PM",
    payment: "Cash",
    phone: "0123456789",
    price: "1.000.000 đ",
    status: "Processing",
  },
  {
    key: "4",
    id: "#123459",
    name: "John Smith",
    address: "Quận 9, TP.HCM",
    date: "12.09.2019 - 12.53 PM",
    payment: "Cash",
    phone: "0123456789",
    price: "1.000.000 đ",
    status: "Delivering",
  },
  {
    key: "5",
    id: "#123460",
    name: "John Smith",
    address: "Quận 9, TP.HCM",
    date: "12.09.2019 - 12.53 PM",
    payment: "Cash",
    phone: "0123456789",
    price: "1.000.000 đ",
    status: "Pending",
  },
  {
    key: "6",
    id: "#123461",
    name: "John Smith",
    address: "Quận 9, TP.HCM",
    date: "12.09.2019 - 12.53 PM",
    payment: "Cash",
    phone: "0123456789",
    price: "1.000.000 đ",
    status: "Request Return",
  },
];

const statusColors = {
  Rejected: "red",
  Completed: "green",
  Processing: "blue",
  Delivering: "orange",
  Pending: "yellow",
  "Request Return": "purple",
};

const statuses = [
  "All orders",
  "Pending",
  "Processing",
  "Delivering",
  "Completed",
  "Rejected",
  "Request Return",
];

const OrderManagement = () => {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [selectedStatus, setSelectedStatus] = useState("All orders");
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilter = (status) => {
    setSelectedStatus(status);
    if (status === "All orders") {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((order) => order.status === status));
    }
    setCurrentPage(1);
  };

  const handleChangeStatus = (record, newStatus) => {
    const newData = data.map((item) => {
      if (item.key === record.key) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    setData(newData);
    setFilteredData(newData);
  };

  const statusMenu = (record) => (
    <Menu>
      {statuses.map((status) => (
        <Menu.Item
          key={status}
          onClick={() => handleChangeStatus(record, status)}
        >
          {status}
        </Menu.Item>
      ))}
    </Menu>
  );

  const actionMenu = (record) => (
    <Menu>
      <Menu.Item key="changeStatus">
        <Dropdown overlay={statusMenu(record)} trigger={["click"]}>
          <span>Change status</span>
        </Dropdown>
      </Menu.Item>
      <Menu.Item key="orderDetail">
        <Link to={`/order-detail/${record.key}`}>Order Detail</Link>
      </Menu.Item>
      {record.status === "Request Return" && (
        <Menu.Item key="viewRequest">
          <Link to={`/view-request/${record.key}`}>View Request</Link>
        </Menu.Item>
      )}
      <Menu.Item key="cancel">Cancel</Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Payment",
      dataIndex: "payment",
      key: "payment",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return (
          <Tag color={statusColors[status]} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Dropdown overlay={actionMenu(record)} trigger={["click"]}>
          <Button icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Order Management</h1>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 flex space-x-2">
          <Input placeholder="Search by phone" prefix={<SearchOutlined />} className="max-w-[380px]" />
          <RangePicker className="min-w-[380px]"
            id={{
              start: 'startInput',
              end: 'endInput',
            }}
            onFocus={(_, info) => {
              console.log('Focus:', info.range);
            }}
            onBlur={(_, info) => {
              console.log('Blur:', info.range);
            }}
          />
        </div>
      </div>
      <div className="mb-4">
        {statuses.map(status => {
          return (<Button key={status}
            className={`mr-4 ${selectedStatus === status && "bg-blue-500 text-white"
              }`}
            onClick={() => handleFilter(status)}
          >
            {status}
          </Button>)
        })}
      </div>
      <CustomTable columns={columns} list={filteredData} />
    </>
  );
};

export default OrderManagement;
