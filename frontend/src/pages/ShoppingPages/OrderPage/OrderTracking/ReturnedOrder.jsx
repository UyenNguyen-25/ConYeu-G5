import { delivery } from '@/assets/logo';
import React, { useEffect, useState } from 'react'

const ReturnedOrder = () => {
    const [empty, setEmpty] = useState(false);
    const [detail, setDetail] = useState();
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
    return (
        <div className='py-6'>
            <h1 className='font-semibold'>DANH SÁCH ĐƠN TRẢ HÀNG</h1>
            {
                false ? (
                    <div className='flex flex-col justify-center items-center gap-6'>
                        <img className='w-1/6 mx-auto' src={delivery} />
                        <h1>Hiện chưa có đơn hàng nào đã trả</h1>
                    </div>
                ) : (
                    <div className=' bg-[#F4F5F6] my-4 px-3 py-3'>
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
                            <button className='bg-white text-[#E44918] px-2 py-1 border border-gray-300 hover:underline rounded-md'>Xem chi tiết yêu cầu trả hàng/ hoàn tiền</button>
                            <p className='font-bold'>Tổng tiền hoàn trả</p>
                            <h1 className='font-bold text-[#E44918]'>{formatter.format(detail?.Price)}</h1>
                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default ReturnedOrder