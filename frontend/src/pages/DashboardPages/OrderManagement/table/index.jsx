/* eslint-disable react-hooks/exhaustive-deps */
import { Popconfirm, Table, Tag, Typography } from "antd"
import { useEffect, useState } from "react";
import { statusColors, statuses } from "./option";
import { format } from "date-fns";
import { useUpdateOrderStatusMutation } from "@/redux/features/orders/ordersApiSlice";
import { toast } from "sonner";
import OrderItems from "./order-items";

const CustomTable = ({ list, Loading, refetch }) => {
    const [data, setData] = useState()
    // eslint-disable-next-line no-unused-vars
    const [nextStatus, setNextStatus] = useState()
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
        total: list?.length,
    });
    const formatter = new Intl.NumberFormat("vi", {
        style: "currency",
        currency: "VND",
    });
    const [updateOrderStatus, { isSuccess, isError, error }] = useUpdateOrderStatusMutation()

    useEffect(() => { setData(list) }, [list])

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

    // const handleDropdownRender = (status) => {
    //     return <div className="bg-white min-w-[90px] text-center shadow-2xl rounded-lg flex flex-col space-y-2 p-2">

    //     </div>
    // }
    const updateStatus = async (value, order_id) => {
        // console.log(order_id);
        if (value !== "accept" && value !== "reject") {
            const foundStatus = statuses.map((status, index) => {
                if (status.toLowerCase() === value) {
                    return statuses[index + 1]
                }
            }
            ).find(status => status)

            // console.log("foundStatus", foundStatus);
            setNextStatus(foundStatus)
            await updateOrderStatus({ statusUpdate: foundStatus.toLowerCase(), order_id: order_id })
        } else if (value === "accept") {
            setNextStatus("Processing")
            await updateOrderStatus({ statusUpdate: "processing", order_id: order_id })
        } else {
            setNextStatus("Cancelled")
            await updateOrderStatus({ statusUpdate: "cancelled", order_id: order_id })
        }
    }

    useEffect(() => {
        if (isError) {
            toast.error("Something is wrong")
        } else if (isSuccess) {
            toast.success("Update order status successfully")
            refetch()
        }
    }, [error, isError, isSuccess])

    const columns = [
        {
            title: "ID",
            dataIndex: "_id",
            hidden: true
        },
        {
            title: "No",
            dataIndex: "key",
        },
        {
            title: "Phone Number",
            dataIndex: "user_id",
            render: (value) => value?.user_phoneNumber
        },
        {
            title: "Payment Method",
            dataIndex: "payment_method",
            render: (value) => value?.toUpperCase(),
            filters: [
                {
                    text: "Momo",
                    value: "momo",
                },
                {
                    text: "COD",
                    value: "COD",
                },
            ],
            onFilter: (value, record) => record.payment_method === value,
        },
        {
            title: "Created Date",
            dataIndex: "createdAt",
            render: (value) => format(new Date(value), "d/MM/yyy h:mm a"),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        }, {
            title: "Updated Date",
            dataIndex: "updatedAt",
            render: (value) => format(new Date(value), "d/MM/yyy h:mm a"),
            sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
        },
        {
            title: "Total Money",
            dataIndex: "total_money",
            render: (value) => formatter.format(value),
            sorter: (a, b) => (a.total_money - b.total_money),
        },
        {
            title: "Status",
            dataIndex: "order_status_id",
            render: (order_status) => {
                const status = order_status?.order_status_description
                return (
                    <Tag color={statusColors[status]} key={status}>
                        {status?.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: "Action",
            key: "action",
            render: (text, record) => {
                const status = record?.order_status_id?.order_status_description
                return status === "completed" || status === "cancelled" ?
                    <></>
                    : status === "pending" ? <div className="space-x-5">
                        <Typography.Link onClick={(event) => updateStatus(event.currentTarget.ariaValueText, record._id)} aria-valuetext="accept">Accept</Typography.Link>
                        <Popconfirm title="Sure to reject?" ariaValueText="cancelled" onConfirm={() => updateStatus("reject", record._id)}>
                            <Typography.Link type="danger">Reject</Typography.Link>
                        </Popconfirm>
                    </div> :
                        <div className="space-x-5">
                            <Popconfirm title="Sure to confirm?" onConfirm={() => updateStatus(status, record._id)}>
                                <Typography.Link >Confirm</Typography.Link>
                            </Popconfirm>
                            <Popconfirm title="Sure to cancel?" onConfirm={() => updateStatus("reject", record._id)}>
                                <Typography.Link type="danger">Cancel</Typography.Link>
                            </Popconfirm>
                        </div>

            }
        },
    ];


    return <><Table
        columns={columns}
        dataSource={data}
        onChange={handleTableChange}
        loading={Loading}
        pagination={{
            ...tableParams,
            position: ["", "bottomCenter"],
        }}
        expandable={
            {
                expandedRowRender: (record) => {
                    const receiver = record?.address
                    return <div className="bg-white px-8 py-6 rounded-lg shadow-md ">
                        <Typography.Title level={5} className="">Order Items:</Typography.Title>
                        <div className="">
                            <OrderItems orderDetails={record} formatter={formatter} />
                        </div>
                        <Typography.Title level={5} className="">Received Information:</Typography.Title>
                        <div className="flex">
                            <div className="min-w-[120px] text-right mr-5 font-semibold">
                                Full Name:
                            </div>
                            <span className="font-normal">{receiver?.fullname ? receiver?.fullname : "No Data"}</span>
                        </div>
                        <div className="flex">
                            <div className="min-w-[120px] text-right mr-5 font-semibold">
                                Phone Number:
                            </div>
                            <span className="font-normal">{receiver?.phoneNumber ? receiver?.phoneNumber : "No Data"}</span>
                        </div>
                        <div className="flex">
                            <div className="min-w-[120px] text-right mr-5 font-semibold">
                                Address:
                            </div>
                            <span className="font-normal">{receiver?.fullAddress ? receiver?.fullAddress : "No Data"}</span>
                        </div>
                    </div>

                }
            }
        }
    />
    </>

}

export default CustomTable