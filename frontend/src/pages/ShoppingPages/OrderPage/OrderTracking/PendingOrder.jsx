import React, { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';

const PendingOrder = () => {
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
            <img className='w-1/6 mx-auto' src='dist/delivery.jpg' />
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
              {/* <button className='bg-[#E44918] text-white px-2 py-1'>Hủy đơn</button> */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className='bg-[#E44918]  text-white px-4 py-2 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:bg-[#C93D15] hover:shadow-xl hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed7753]' variant="outline">Hủy đơn</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className='bg-white'>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có muốn hủy đơn hàng này không?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn sẽ không thể thay đổi khi ấn xác nhận.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction className='bg-[#E44918] text-white hover:bg-[#ec7c5a]'>Xác nhận</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <p className='font-bold'>Tổng</p>
              <h1 className='font-bold text-[#E44918]'>{formatter.format(detail?.Price)}</h1>
            </div>
          </div>
        )
      }

    </div>
  )
}

export default PendingOrder