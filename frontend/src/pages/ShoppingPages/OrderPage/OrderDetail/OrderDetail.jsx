import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderDetail = () => {
  const nav = useNavigate();
  return (
    <div className='flex flex-col mx-12 my-6'>
      <div className='flex justify-between items-center mb-6'>
        <button className='bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300' onClick={() => nav('/purchase')}>
        &lt; Trở về
        </button>
      </div>

      <div className='flex flex-row gap-8'>
        <div className='bg-white px-8 py-6 rounded-lg shadow-md basis-2/3'>
          <div className='flex gap-6 mb-4'>
            <div>
              <p className='text-2xl font-semibold'>Chi tiết đơn hàng</p>
            </div>
            <div className='bg-blue-500 text-white px-4 py-1 rounded-full'>Đang chờ giao</div>
          </div>

          <div className='flex justify-between mb-4'>
            <div className='flex items-center'>
              <div className='w-16 h-16 bg-blue-200 flex items-center justify-center'></div>
              <div className='ml-4'>
                <p className='font-semibold'>Wireless Headphones with Noise Cancellation Tru Bass Bluetooth HiFi</p>
                <p className='text-sm text-gray-600'>x 1</p>
              </div>
            </div>
            <div>
              <p>$79.99</p>
            </div>
          </div>

          <div className='flex justify-between mb-4'>
            <div className='flex items-center'>
              <div className='w-16 h-16 bg-pink-200 flex items-center justify-center'></div>
              <div className='ml-4'>
                <p className='font-semibold'>Smartwatch IP68 Waterproof GPS and Bluetooth Support</p>
                <p className='text-sm text-gray-600'>x 1</p>
              </div>
            </div>
            <div>
              <p>$79.99</p>
            </div>
          </div>

          <div className='border-t pt-4 flex flex-col gap-5'>
            <div className='flex justify-between'>
              <p>Tạm tính</p>
              <p>$159.98</p>
            </div>
            <div className='flex justify-between'>
              <p>Phí vận chuyển</p>
              <p>$20.00</p>
            </div>
            <div className='flex justify-between font-bold text-red-500'>
              <p>TOTAL</p>
              <p>$169.98</p>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-6 basis-1/3'>
          <div className='bg-white px-8 py-6 rounded-lg shadow-md flex flex-col gap-4'>
            <p className='font-semibold'>Phương thức thanh toán</p>
            <p>Ship COD</p>
            <p>Tổng: $169.98 <span className='bg-green-200 text-green-800 px-2 py-1 rounded-full ml-6'>CHƯA TRẢ</span></p>
          </div>
          <div className='bg-white px-8 py-6 rounded-lg shadow-md'>
            <p className='font-semibold'>Thông tin nhận hàng</p>
            <div className='mt-2'>
              <p className='font-semibold'>Address</p>
              <p>John Doe</p>
              <p>1355 Market St, Suite 900</p>
              <p>San Francisco, CA 94103</p>
              <p>📞: (123) 456-7890</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
