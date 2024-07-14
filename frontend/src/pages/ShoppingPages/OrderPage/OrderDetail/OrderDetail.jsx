import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '@/constants/apiConfig';
import { useSelector } from 'react-redux';
import { Tag } from 'antd';

const OrderDetail = () => {
  const token = useSelector((state) => state.auth.token);
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [products, setProducts] = useState({});
  const nav = useNavigate();
  const { orderId } = useParams();
  const formatter = new Intl.NumberFormat('vi', {
    style: 'currency',
    currency: 'VND',
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/order/get-order-detail/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrderDetails(response.data);
        console.log('first', response.data)

        const productIds = response.data.order_items.map((item) => item.product_id);
        fetchProductDetails(productIds);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/payment/get-payment-by-order-id/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPaymentDetails(response.data);
      } catch (error) {
        console.error('Error fetching payment details:', error);
      }
    };

    if (orderId) {
      fetchOrderDetails();
      fetchPaymentDetails();
    }
  }, [orderId, token]);

  const fetchProductDetails = async (productIds) => {
    try {
      const responses = await Promise.all(
        productIds.map((productId) =>
          axios.get(`${BASE_URL}/api/product/get-product-by-id/${productId}`)
        )
      );

      const productDetails = responses.reduce((acc, response) => {
        const product = response.data.product;
        console.log('product', product)
        acc[product._id] = product;
        return acc;
      }, {});

      // console.log('productDetails', productDetails)

      setProducts(productDetails);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  console.log('productssss', products)
  console.log('orderDetails', orderDetails)

  if (!orderDetails || !paymentDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col mx-12 my-6'>
      <div className='flex justify-between items-center mb-6'>
        <button
          className='bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300'
          onClick={() => nav('/purchase')}
        >
          &lt; Trở về
        </button>
      </div>

      <div className='flex flex-row gap-8'>
        <div className='bg-white px-8 py-6 rounded-lg shadow-md basis-2/3'>
          <div className='flex gap-6 mb-4'>
            <div>
              <p className='text-2xl font-semibold'>Chi tiết đơn hàng</p>
            </div>
            <div className='bg-blue-500 text-white px-4 py-1 rounded-full'>
              {orderDetails.order_status_id.order_status_description}
            </div>
          </div>

          {orderDetails.order_items.map((item) => (
            <div key={item._id} className='flex justify-between mb-4 cursor-pointer' onClick={() => nav(`/products/${item.product_id}`)}>
              <div className='flex items-center'>
                <img className='w-16 h-16' src={products[item.product_id]?.product_img} />
                <div className='ml-4'>
                  <p className='font-semibold'>
                    {products[item.product_id]
                      ? products[item.product_id]?.product_name
                      : 'Loading...'}
                  </p>
                  <p className='text-sm text-gray-600'>x {item.quantity}</p>
                </div>
              </div>
              <div>
                <p>{formatter.format(item.price)}</p>
              </div>
            </div>
          ))}

          <div className='border-t pt-4 flex flex-col gap-5'>
            <div className='flex justify-between'>
              <p>Tạm tính</p>
              <p>{formatter.format(orderDetails.total_money)}</p>
            </div>
            <div className='flex justify-between'>
              <p>Phí vận chuyển</p>
              <p>{formatter.format(0)}</p>
            </div>
            <div className='flex justify-between font-bold text-red-500'>
              <p>TỔNG CỘNG</p>
              <p>{formatter.format(orderDetails.total_money)}</p>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-6 basis-1/3'>
          <div className='bg-white px-8 py-6 rounded-lg shadow-md flex flex-col gap-4'>
            <p className='font-semibold'>Phương thức thanh toán</p>
            <p>{orderDetails.paymentMethod}</p>
            <p>
              Tổng: {formatter.format(orderDetails.total_money)}{' '}
              <span
                className={`bg-${paymentDetails.payment_status === 'Paid' ? 'green' : 'red'
                  }-200 text-${paymentDetails.payment_status === 'Paid' ? 'green' : 'red'
                  }-800 px-2 py-1 rounded-full ml-6`}
              >
                <Tag color={paymentDetails.payment_status === 'Paid' ? '#87d068' : '#f50'}>
                  {paymentDetails.payment_status === 'Paid' ? 'ĐÃ TRẢ' : 'CHƯA TRẢ'}
                </Tag>
              </span>
            </p>
          </div>
          <div className='bg-white px-8 py-6 rounded-lg shadow-md'>
            <p className='font-semibold'>Thông tin nhận hàng</p>
            <div className='mt-2'>
              <p className='font-semibold'>Địa chỉ</p>
              <p className='mt-3'>{orderDetails.address.fullname}</p>
              <p>{orderDetails.address.fullAddress}</p>
              <p className='mt-3'>📞: {orderDetails.address.phoneNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
