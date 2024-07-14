/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/redux/features/cart/cartSlice";
import { Button, message, Popconfirm } from "antd";
import AddAddress from "./AddAddress";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/constants/apiConfig";
import { emptyCart } from "@/assets/logo";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import EditAddress from "./EditAddress";

const CartPage = () => {
  const nav = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const userDetail = useSelector(selectCurrentUser);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingAddress, setShippingAddress] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [text, setText] = React.useState("https://ant.design/");
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const formatter = new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "VND",
  });
  const temporaryTotal = cartItems.reduce(
    (total, item) => total + item.product_price * item.quantity,
    0
  );
  console.log(token)
  console.log('user', userDetail)

  // useEffect(() => {
  //   const storedAddress = localStorage.getItem('shippingAddress');
  //   console.log('storedAddress', storedAddress)
  //   if (storedAddress) {
  //     setShippingAddress(JSON.parse(storedAddress));
  //   }
  // }, []);

  useEffect(() => {
    if (userDetail.user_id) {
      fetchShippingAddress();
    }
  }, [userDetail.user_id, token]);


  const fetchShippingAddress = async () => {
    console.log('userDetail.user_id', userDetail.user_id)
    try {
      const response = await axios.post(
        `${BASE_URL}/api/user/get-user-address`,
        { user_id: userDetail.user_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('response.data', response)
      if (response.data) {
        console.log('response.data', response.data)
        setShippingAddress(response.data.address);
      } else {
        setShippingAddress(null);
      }
    } catch (error) {
      console.error("Error fetching shipping address:", error);
      setShippingAddress(null);
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/product/get-product-by-id/${productId}`);
      return response.data.product;
    } catch (error) {
      console.error(`Failed to fetch product details for product_id ${productId}`, error);
      return null;
    }
  };

  console.log('ShippingAddressssssssssssssss', typeof shippingAddress.address_line1)

  const handleDecrease = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleIncrease = async (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const confirm = (productId) => {
    console.log(productId);
    dispatch(removeFromCart(productId));
  };
  const cancel = (e) => {
    console.log(e);
  };

  const handlePayment = async () => {
    if (!shippingAddress) {
      message.error("Vui lòng thêm địa chỉ giao hàng");
      return;
    }

    const orderItems = cartItems.map((item) => ({
      product_id: item._id,
      quantity: item.quantity,
    }));

    const orderData = {
      user_id: userDetail.user_id,
      order_items: orderItems,
      payment_method: paymentMethod,
      shippingAddress,
    };
    console.log('order data', orderData)

    try {
      const response = await axios.post(
        `${BASE_URL}/api/order/create-new-order`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 201) {
        if (paymentMethod === "COD") {
          message.success("Đặt hàng thành công!");
          dispatch(clearCart());
          nav(`/order-confirmation?orderId=${response.data._id}`);
        } else if (paymentMethod === "momo") {
          const momoData = {
            orderId: response.data._id,
            amount: response.data.total_money,
          };
          const momoResponse = await axios.post(`${BASE_URL}/api/momo/payment`, momoData);
          if (momoResponse.data && momoResponse.data.payUrl) {
            window.location.href = momoResponse.data.payUrl;
            dispatch(clearCart());
          } else {
            console.error("Thanh toán MoMo không thành công:", momoResponse.data);
            message.error("Thanh toán MoMo không thành công");
          }
        }
      } else {
        message.error("Đặt hàng thất bại, vui lòng thử lại");
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      message.error("Đặt hàng thất bại, vui lòng thử lại");
    }
  };
  return (
    <div className=" py-9 px-24">
      <h1 className="text-4xl font-semibold pb-10">Giỏ Hàng</h1>
      {cartItems.length === 0 ? (
        <div className="justify-center items-center flex flex-col">
          <img src={emptyCart} className="w-1/3 mx-auto -mt-10" />
          <h1 className="text-xl font-semibold">Giỏ hàng hiện đang trống...</h1>
          <button
            className="text-base border border-transparent bg-[#E44918] hover:bg-[#d63e12] rounded-full text-white px-6 py-3 mt-6 transition duration-300 transform hover:scale-105 shadow-lg"
            onClick={() => nav("/products?page=1&per_page=8")}
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <div className="flex gap-6">
          <div className="w-4/5 bg-white py-9 px-6 shadow-lg rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px] text-lg text-[#8B8B8B]">
                    Sản phẩm
                  </TableHead>
                  <TableHead className="w-[100px] text-lg text-[#8B8B8B]">
                    Đơn giá
                  </TableHead>
                  <TableHead className="w-[100px] text-lg text-[#8B8B8B]">
                    Số lượng
                  </TableHead>
                  <TableHead className="w-[150px] text-lg text-[#8B8B8B]">
                    Thành tiền
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="flex">
                      <img className="w-24" src={item.product_img} />
                      <p className="w-full flex items-center font-medium text-base">
                        {item.product_name}
                      </p>
                    </TableCell>
                    <TableCell className="text-base font-semibold">
                      {formatter.format(item.product_price)}
                    </TableCell>
                    {/* <TableCell className="text-lg">{item.quantity}</TableCell> */}
                    <TableCell>
                      <div className="flex gap-x-0">
                        <button
                          className="bg-[#E5E9EB] w-7 py-1 rounded-l-full font-bold"
                          onClick={() => handleDecrease(item._id)}
                        >
                          <MinusOutlined />
                        </button>
                        <p className="bg-[#E5E9EB] text-center py-1 w-7 text-xl">
                          {item.quantity}
                        </p>
                        <button
                          className="bg-[#E5E9EB] w-7 py-1 rounded-r-full font-bold"
                          onClick={() => handleIncrease(item._id)}
                        >
                          <PlusOutlined />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-base font-semibold ">
                      {formatter.format(item.product_price * item.quantity)}
                      <Popconfirm
                        className="ml-6"
                        title="Xóa sản phẩm khỏi giỏ hàng?"
                        onConfirm={() => confirm(item._id)}
                        onCancel={cancel}
                        okText="Ok"
                        cancelText="Hủy"
                      >
                        <Button danger>Xóa</Button>
                      </Popconfirm>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col gap-6 w-1/3">
            <div className="rounded-lg bg-white p-6 shadow-lg">
              {shippingAddress.address_line1.length != 0 ? (
                <>
                  <div className="flex gap-12">
                    <h1 className="text-xl font-bold mb-2">Địa Chỉ Nhận Hàng</h1>
                    <EditAddress setShippingAddress={setShippingAddress} shippingAddress={shippingAddress} />
                  </div>
                  <div className=" flex justify-center gap-3 p-3 rounded-lg">
                    <div>
                      {/* <p>{shippingAddress.address.fullname},</p>
                      <p>{shippingAddress.address.phoneNumber},</p>
                      <p>{shippingAddress.address.address_line1}</p> */}
                      <div className="flex gap-2 mb-1">
                        <p className="text-lg font-semibold">{shippingAddress.fullname} | </p>
                        <p className="text-lg text-orange-600 font-bold">{shippingAddress.phoneNumber}</p>
                      </div>
                      <p>{shippingAddress.address_line1}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-xl font-bold mb-4">Địa Chỉ Nhận Hàng</h1>
                  <div className="flex justify-center gap-3 p-3">
                    <AddAddress setShippingAddress={setShippingAddress} />
                  </div>
                </>
              )}
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg flex flex-col gap-2">
              <p className="text-xl font-bold mb-2">Phương thức thanh toán</p>
              <div>
                <input
                  type="radio"
                  id="COD"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                <label htmlFor="COD" className="ml-2 cursor-pointer">Thanh toán khi nhận hàng</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="momo"
                  name="paymentMethod"
                  value="momo"
                  checked={paymentMethod === "momo"}
                  onChange={() => setPaymentMethod("momo")}
                />
                <label htmlFor="momo" className="ml-2 cursor-pointer">Thanh toán qua Momo</label>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-lg">
              <Table>
                <TableBody className="text-lg">
                  <TableRow>
                    <TableCell className="text-[#8B8B8B]">Tính tạm</TableCell>
                    <TableCell>{formatter.format(temporaryTotal)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-[#8B8B8B]">Phí vận chuyển</TableCell>
                    <TableCell>+{formatter.format(0)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-[#8B8B8B]">Tổng tiền</TableCell>
                    <TableCell>{formatter.format(temporaryTotal)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <button className="bg-[#007AFB] hover:bg-blue-700 text-white rounded-lg w-full py-3 font-semibold mt-4" onClick={handlePayment}>
                ĐẶT HÀNG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;