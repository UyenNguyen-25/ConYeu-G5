import React, { useEffect, useState } from 'react'
import { Button, Popover, Space } from 'antd';
import { delivery } from '@/assets/logo';
const CanceledOrder = () => {
    const [empty, setEmpty] = useState(false);
    const [detail, setDetail] = useState();
    const formatter = new Intl.NumberFormat("vi", {
        style: "currency",
        currency: "VND",
    });

    const content = (
        <div>
            <p className='font-semibold'>Hủy lúc: <span className='font-light'>09-04-2024 19:42</span> </p>
            <p className='font-semibold'>Hủy bởi: <span className='font-light'>người mua</span></p>
            <p className='font-semibold'>Phương thức thanh toán: <span className='font-light'>COD</span></p>
        </div>
    );
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
            <h1 className='font-semibold'>DANH SÁCH ĐƠN HÀNG ĐÃ HỦY</h1>
            {
                false ? (
                    <div className='flex flex-col justify-center items-center gap-6'>
                        <img className='w-1/6 mx-auto' src={delivery} />
                        <h1>Hiện chưa có đơn hàng nào đã hủy</h1>
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
                            {/* <button className='bg-white text-[#E44918] px-2 py-1 border border-gray-300 hover:underline rounded-md'>Xem chi tiết hủy đơn</button> */}
                            <Popover content={content} title="Chi tiết" trigger="click">
                                <Button>Xem chi tiết hủy đơn</Button>
                            </Popover>
                            <p className='font-bold'>Tổng</p>
                            <h1 className='font-bold text-[#E44918]'>{formatter.format(detail?.Price)}</h1>
                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default CanceledOrder