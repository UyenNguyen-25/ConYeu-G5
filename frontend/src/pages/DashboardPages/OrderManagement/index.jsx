import { useEffect, useState } from "react";
import {
  Button,
  Input,
  DatePicker,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import CustomTable from "./table";
import { useGetOrdersQuery } from "@/redux/features/orders/ordersApiSlice";
import { statuses } from "./table/option";

const { RangePicker } = DatePicker;

const OrderManagement = () => {
  const [filteredData, setFilteredData] = useState();
  const [selectedStatus, setSelectedStatus] = useState("All orders");
  const [query, setQuery] = useState({
    user_phoneNumber: "",
    status: "",
    from: "",
    to: ""
  })
  const { data: orders, refetch, isLoading } = useGetOrdersQuery(query, {
    pollingInterval: 2000,
    skipPollingIfUnfocused: true,
    refetchOnMountOrArgChange: true,
    // refetchOnReconnect: true,
    // refetchOnFocus: true,
  })

  useEffect(() => {
    const initialData = orders?.map((order, index) => {
      return {
        key: index + 1,
        payment_method: order.payment.payment_method,
        ...order.order,
      }
    })
    setFilteredData(initialData)
  }, [orders])

  const handleFilterStatus = (status) => {
    setSelectedStatus(status);
    if (status === "All orders") {
      setQuery(query => ({ ...query, status: "" }))
    } else {
      setQuery(query => ({ ...query, status: status.toLowerCase() }))
    }
  };

  const handleFilterDate = (date) => {
    if (date) {
      setQuery(query => ({ ...query, from: date[0].format("YYYY-MM-D"), to: date[1].format("YYYY-MM-D") }))
    } else setQuery(query => ({ ...query, from: "", to: "" }))
  }

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Order Management</h1>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 flex space-x-2">
          <Input placeholder="Search by phone" prefix={<SearchOutlined />}
            className="max-w-[340px]"
            onChange={(event) => {
              setQuery(query => ({ ...query, user_phoneNumber: event.target.value }))
            }}
          />
          <RangePicker
            format={(value) => value.format("D/MM/YYYY")}
            onChange={handleFilterDate}
          />
        </div>
      </div>
      <div className="mb-4">
        {statuses.map(status => {
          return (<Button key={status}
            className={`mr-2 ${selectedStatus === status && "bg-blue-500 text-white"
              }`}
            onClick={() => handleFilterStatus(status)}
          >
            {status}
          </Button>)
        })}
      </div>
      <CustomTable list={filteredData} Loading={isLoading} refetch={refetch} selectedStatus={selectedStatus} />
    </>
  );
};

export default OrderManagement;
