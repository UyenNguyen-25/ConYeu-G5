import { delivery } from '@/assets/logo';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const PreparingOrder = () => {
  const [empty, setEmpty] = useState(false);
  const [detail, setDetail] = useState();
  const navigate = useNavigate();
  const formatter = new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "VND",
  });
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(
          `https://65459563fe036a2fa954853b.mockapi.io/api/v1/product/1`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const productDetail = await response.json();
        console.log("jjjjjjjjjjj", productDetail);
        setDetail(productDetail);
      } catch (error) {
        console.error("Fail to fetch", error);
      }
    };
    fetchDetail();
  }, []);

  const handleViewDetail = () => {
    navigate(`/purchase/order-detail`)
  }
  return (
    <div className='py-6'>
      <h1 className='font-semibold'>DANH SÁCH ĐƠN HÀNG CHỜ XÁC NHẬN</h1>
      {
        false ? (
          <div className='flex flex-col justify-center items-center gap-6'>
            <img className='w-1/6 mx-auto' src={delivery} />
            <h1>Hiện chưa có đơn hàng nào chờ xác nhận</h1>
          </div>
        ) : (
          <div className=' bg-[#F4F5F6] my-4 px-3 py-3 cursor-pointer' onClick={() => handleViewDetail()}>
            <div className='flex flex-row'>
              <div className='basis-1/5'>
                <img className='  w-[100px]' src={detail?.Image} />
              </div>
              <div className='flex flex-col gap-4 basis-3/5'>
                <h1 className='font-semibold'>{detail?.Name}</h1>
                <h1>x 1</h1>
              </div>
              <h1 className='font-bold text-[#E44918] basis-1/5 grid content-center '>{formatter.format(detail?.Price)}</h1>
            </div>
            <hr class="w-full h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
            <div className='flex gap-10 justify-end mx-6 my-4'>
              <p className='font-bold'>Tổng</p>
              <h1 className='font-bold text-[#E44918]'>{formatter.format(detail?.Price)}</h1>
            </div>
          </div>
        )
      }

    </div>
  )
}

export default PreparingOrder