import { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Input,
  DatePicker,
  Pagination,
  Dropdown,
  Menu,
} from "antd";
import { SearchOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "tailwindcss/tailwind.css";

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
    status: "Preparing",
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
    status: "Dispatch",
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
  Preparing: "blue",
  Dispatch: "orange",
  Pending: "yellow",
  "Request Return": "purple",
};

const statuses = [
  "Rejected",
  "Completed",
  "Preparing",
  "Dispatch",
  "Pending",
  "Request Return",
];

const OrderManagement = () => {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [selectedStatus, setSelectedStatus] = useState("All orders");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleFilter = (status) => {
    setSelectedStatus(status);
    if (status === "All orders") {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((order) => order.status === status));
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
        <div className="flex space-x-2">
          <Input placeholder="Search by phone" prefix={<SearchOutlined />} />
          <RangePicker className="w-full" />
        </div>
      </div>
      <div className="mb-4">
        <Button
          className={`mr-2 ${
            selectedStatus === "All orders" && "bg-blue-500 text-white"
          }`}
          onClick={() => handleFilter("All orders")}
        >
          All orders
        </Button>
        <Button
          className={`mr-2 ${
            selectedStatus === "Pending" && "bg-blue-500 text-white"
          }`}
          onClick={() => handleFilter("Pending")}
        >
          Pending
        </Button>
        <Button
          className={`mr-2 ${
            selectedStatus === "Preparing" && "bg-blue-500 text-white"
          }`}
          onClick={() => handleFilter("Preparing")}
        >
          Preparing
        </Button>
        <Button
          className={`mr-2 ${
            selectedStatus === "Dispatch" && "bg-blue-500 text-white"
          }`}
          onClick={() => handleFilter("Dispatch")}
        >
          Dispatch
        </Button>
        <Button
          className={`mr-2 ${
            selectedStatus === "Completed" && "bg-blue-500 text-white"
          }`}
          onClick={() => handleFilter("Completed")}
        >
          Completed
        </Button>
        <Button
          className={`mr-2 ${
            selectedStatus === "Rejected" && "bg-blue-500 text-white"
          }`}
          onClick={() => handleFilter("Rejected")}
        >
          Rejected
        </Button>
        <Button
          className={`mr-2 ${
            selectedStatus === "Request Return" && "bg-blue-500 text-white"
          }`}
          onClick={() => handleFilter("Request Return")}
        >
          Request Return
        </Button>
      </div>
      <Table columns={columns} dataSource={paginatedData} pagination={false} />
      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          total={filteredData.length}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default OrderManagement;
