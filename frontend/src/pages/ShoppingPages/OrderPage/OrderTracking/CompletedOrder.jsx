import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { delivery } from '@/assets/logo';
import axios from 'axios';
import { BASE_URL } from '@/constants/apiConfig';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { Button, message, Modal, Tag } from 'antd';
import OrderReview from './components/order-review';

const CompletedOrder = () => {
  const userDetail = useSelector(selectCurrentUser);
  const token = useSelector((state) => state.auth.token);
  const [empty, setEmpty] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const navigate = useNavigate();
  const formatter = new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "VND",
  });

  const showModal = (orderId) => {
    setSelectedOrderItems(orderId);
    setIsModalOpen(true);
  };

  const handleOk = async (feedbackData) => {
    try {
      console.log('feedbackData', feedbackData)
      for (const feedback of feedbackData) {
        const response = await axios.post(
          `${BASE_URL}/api/feedback/create-feedback`,
          feedback,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('response', response)
      }
      message.success("Review submitted successfully");
      fetchOrders();
    } catch (error) {
      console.error("Failed to submit review", error);
      message.error("Failed to submit review");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/order/get-order-by-status-userId`,
        {
          userId: userDetail.user_id,
          status: 'completed'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('response', response)

      if (response.data.length === 0) {
        setEmpty(true);
      } else {
        const ordersWithDetails = await Promise.all(response.data.map(async order => {
          const orderItemsWithDetails = await Promise.all(order.order_items.map(async item => {
            try {
              const productResponse = await axios.get(`${BASE_URL}/api/product/get-product-by-id/${item.product_id}`);
              console.log('productResponse', productResponse)

              return {
                ...item,
                product: productResponse.data,
              };
            } catch (error) {
              console.error(`Failed to fetch product details for product_id ${item.product_id}`, error);
              return item;
            }
          }));
          return {
            ...order,
            order_items: orderItemsWithDetails
          };
        }));
        setOrders(ordersWithDetails);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, userDetail.user_id]);

  const handleViewDetail = (orderId) => {
    navigate(`/order/order-detail/${orderId}`);
  };

  console.log('orders', orders)

  return (
    <div className='py-6'>
      <h1 className='font-semibold'>DANH SÁCH ĐƠN HÀNG ĐÃ GIAO</h1>
      {empty ? (
        <div className='flex flex-col justify-center items-center gap-6'>
          <img className='w-1/6 mx-auto' src={delivery} alt="delivery" />
          <h1>Hiện chưa có đơn hàng nào đã giao</h1>
        </div>
      ) : (
        orders.map(order => (
          <div key={order._id} className='bg-[#F4F5F6] my-4 px-3 py-3'>
            <div className='cursor-pointer' onClick={() => handleViewDetail(order._id)}>
              {order.order_items.map(item => (
                <React.Fragment key={item._id}>
                  <div className='flex flex-row'>
                    <div className='basis-1/5'>
                      <img className='w-[100px]' src={item.product?.product.product_img || delivery} alt={item.product?.product.product_name || 'No image'} />
                    </div>
                    <div className='flex flex-col gap-4 basis-3/5'>
                      <div className='flex flex-col'>
                        <h1 className='font-semibold'>{item.product?.product.product_name || 'No product name'}</h1>
                        <h1>x {item.quantity}</h1>
                      </div>
                    </div>
                    <h1 className='text-black flex-auto text-right mr-5'>{formatter.format(item.price)}</h1>
                  </div>
                </React.Fragment>
              ))}
              {/* <h1 className='font-bold text-[#E44918] basis-1/5 grid content-center '>{formatter.format(order.total_money)}</h1> */}
            </div>
            <hr className="w-full h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
            <div className='flex gap-10 justify-end mx-6 my-4'>
              {/* <button className='bg-[#E44918] text-white px-2 py-1 hover:bg-[#ff7c55]' onClick={() => navigate('/write-feedback')}>Đánh giá</button> */}

              {order.order_items.some(item => item.product?.product.feedback_id.some(feedback => feedback.user_id === userDetail.user_id)) ? (
                <Tag color="green">Đã đánh giá</Tag>
              ) : (
                <>
                  <Button type="primary" onClick={() => showModal(order.order_items)}>
                    Đánh giá
                  </Button>
                  <OrderReview
                    orderItems={selectedOrderItems}
                    visible={isModalOpen}
                    onCancel={handleCancel}
                    onOk={handleOk}
                  />
                </>
              )}
              <p className='font-bold'>Tổng</p>
              <h1 className='font-bold text-[#E44918]'>{formatter.format(order.total_money)}</h1>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CompletedOrder;
