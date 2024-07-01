import { useParams } from "react-router-dom";
import { Table, Tag } from "antd";
import "tailwindcss/tailwind.css";

const orderData = {
  id: "#123456",
  time: "12.09.2019 - 12.53 PM",
  items: [
    { name: "Combo 4 Nutren Junior", price: "2.820.000đ", quantity: 1 },
    { name: "Abbott Ensure Gold", price: "2.820.000đ", quantity: 1 },
  ],
  total: "5.640.000đ",
  status: "Pending",
  receiver: {
    name: "Nobita",
    phone: "0123 456 789",
    address:
      "9 Quân Trọng Linh, phường 7, Quận 8, Thành phố Hồ Chí Minh, Việt Nam",
  },
  return: {
    items: "Combo 4 Nutren Junior, Abbott Ensure Gold",
    reason: [
      "Product is damaged or expired",
      "Packaging is damaged",
      "Counterfeit product",
    ],
    evidence: [
      "https://i.pinimg.com/564x/d5/6f/e5/d56fe5705396d15192054c2f66282340.jpg",
      "https://i.pinimg.com/564x/d5/6f/e5/d56fe5705396d15192054c2f66282340.jpg",
    ],
    refund: {
      money: "5.640.000đ",
      method: "Cash",
    },
  },
};

const OrderDetail = () => {
  const { orderId } = useParams();

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Order Detail</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          Order ID: {orderData.id}
        </h2>
        <p className="mb-4 text-gray-600">Time: {orderData.time}</p>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Items:</h3>
          <Table
            dataSource={orderData.items.map((item, index) => ({
              key: index,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            }))}
            columns={[
              { title: "Item", dataIndex: "name", key: "name" },
              { title: "Price", dataIndex: "price", key: "price" },
              { title: "Quantity", dataIndex: "quantity", key: "quantity" },
            ]}
            pagination={false}
            showHeader={true}
            className="mb-4"
          />
        </div>
        <p className="text-lg font-semibold mb-2">Total: {orderData.total}</p>
        <p className="text-lg font-semibold mb-2">
          Status: <Tag color="blue">{orderData.status}</Tag>
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Receiver's information</h2>
        <p className="mb-2">
          <span className="font-semibold">Name:</span> {orderData.receiver.name}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Phone:</span>{" "}
          {orderData.receiver.phone}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Address:</span>{" "}
          {orderData.receiver.address}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Return/Refund</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-blue-400 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Items for returning</h3>
            <p>{orderData.return.items}</p>
          </div>
          <div className="border border-blue-400 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Reason</h3>
            <ul className="list-disc list-inside">
              {orderData.return.reason.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
            <h3 className="font-semibold mt-4 mb-2">Evidences</h3>
            <div className="flex space-x-2">
              {orderData.return.evidence.length > 0 ? (
                orderData.return.evidence.map((evidence, index) => (
                  <img
                    key={index}
                    src={evidence}
                    alt="Evidence"
                    className="w-24 h-24 object-cover"
                  />
                ))
              ) : (
                <p>No evidence provided</p>
              )}
            </div>
          </div>
          <div className="border border-blue-400 p-4 rounded-lg col-span-1 md:col-span-2">
            <h3 className="font-semibold mb-2">Returning Detail</h3>
            <p>
              <span className="font-semibold">Refund money:</span>{" "}
              {orderData.return.refund.money}
            </p>
            <p>
              <span className="font-semibold">Refund on:</span>{" "}
              {orderData.return.refund.method}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
