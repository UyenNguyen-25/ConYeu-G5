import { Typography } from "antd";

const Dashboard = () => {
  // const [userParams, setUserParams] = useState({
  //   search: "",
  //   role: "",
  // });
  // const [orderParams, setOrderParams] = useState({
  //   user_phoneNumber: "",
  //   from: "",
  //   to: ""
  // })
  // const { products, isLoading: productLoading } = useGetProductsQuery()
  // const { users, isLoading: userLoading } = useGetUsersQuery(userParams)
  // const { orders, isLoading: orderLoading } = useGetOrdersQuery(orderParams)

  return <div>
    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
    <div className="text-center mt-20">
      {/* {productLoading ? <>...</> : products && <div>{products.length}</div>}
      {userLoading ? <>...</> : users && <div>{users.length}</div>}
      {orderLoading ? <>...</> : orders?.length > 0 ? <div>{orders.length}</div> : <>0</>} */}
      <Typography.Title>Welcome To Dashboard</Typography.Title>
    </div>
  </div>;
};

export default Dashboard;
