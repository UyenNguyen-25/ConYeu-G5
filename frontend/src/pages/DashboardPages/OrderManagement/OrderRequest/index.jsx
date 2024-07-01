import { useParams } from "react-router-dom";
import { Table } from "antd";
import "tailwindcss/tailwind.css";

const orderData = {
  id: "#123456",
  items: [
    { name: "Combo 4 Nutren Junior", price: "2.820.000đ", quantity: 1 },
    { name: "Abbott Ensure Gold", price: "2.820.000đ", quantity: 1 },
  ],
  return: {
    items: "Combo 4 Nutren Junior, Abbott Ensure Gold",
    reason: [
      "Product is damaged or expired",
      "Packaging is damaged",
      "Counterfeit product",
    ],
    evidence: [
      "https://i.pinimg.com/564x/d5/6f/e5/d56fe5705396d15192054c2f66282340.jpg",
    ],
    refund: {
      money: "5.640.000đ",
      method: "Cash",
    },
  },
};

const OrderRequest = () => {
  const { orderId } = useParams();

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Order Detail</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Items for returning</h2>
        <h3 className="text-xl font-semibold mb-4">Order ID: {orderData.id}</h3>
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
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Return/Refund</h2>
        <div className="grid md:grid-cols-1 gap-4">
          <div className="border border-gray-200 p-4 rounded-lg">
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
          <div className="border border-gray-200 p-4 rounded-lg col-span-1 ">
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
        <div className="flex justify-end space-x-4 mt-4">
          <button type="primary" className="bg-green-500 p-2 rounded-lg w-fit">
            Approve
          </button>
          <button type="primary" className="bg-red-500 p-2 rounded-lg w-fit">
            Disapprove
          </button>
          <button type="primary" className="bg-gray-500 p-2 rounded-lg w-fit">
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderRequest;
