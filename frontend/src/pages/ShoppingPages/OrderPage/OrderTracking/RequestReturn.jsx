import React, { useState } from 'react';
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';

const RequestReturn = () => {
    const [quantity1, setQuantity1] = useState(1);
    const [quantity2, setQuantity2] = useState(1);
    const nav = useNavigate();

    const handleIncrement = (setQuantity) => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const handleDecrement = (setQuantity) => {
        setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };
    return (
        <div className=' min-h-screen flex flex-col items-center py-10'>
            <div className='mb-6 mr-auto ml-12'>
                <button className='bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300' onClick={() => nav('/purchase')}>
                    &lt; Trở về
                </button>
            </div>
            <div className='bg-white w-3/4 rounded-lg shadow-lg p-8'>
                <h1 className='text-3xl font-semibold text-blue-600 mb-6'>Yêu cầu trả hàng/ hoàn tiền</h1>

                <div className='bg-gray-100 p-4 rounded-lg mb-6'>
                    <p className='font-semibold'>Chúng tôi có thể giúp gì cho ba mẹ?</p>
                    <p className='mt-4'>Tôi đã nhận tất cả hàng nhưng chúng có vấn đề</p>

                </div>

                <p className='mb-4'>Chọn những sản phẩm ba mẹ muốn trả lại nhé.</p>

                <div className='bg-white shadow rounded-lg p-4 mb-4'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center'>
                            <input type='checkbox' className='mr-2' />
                            <img
                                src='https://cdn1.concung.com/storage/2023/03/1677841224-bubs-supreme-junior3.png'
                                alt='Combo 4 Nutren Junior'
                                className='w-16 h-16 rounded-lg'
                            />
                            <div className='ml-4'>
                                <p className='font-semibold'>Combo 4 Nutren Junior</p>
                                <div className="flex gap-x-0 mt-2">
                                    <button
                                        className="bg-[#E5E9EB] w-6 py-1 rounded-l-full font-bold"
                                        onClick={() => handleDecrement(setQuantity1)}
                                    >
                                        <MinusOutlined />
                                    </button>
                                    <p className="bg-[#E5E9EB] text-center py-1 w-5">
                                        {quantity1}
                                    </p>
                                    <button
                                        className="bg-[#E5E9EB] w-6 py-1 rounded-r-full font-bold"
                                        onClick={() => handleIncrement(setQuantity1)}
                                    >
                                        <PlusOutlined />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className='font-semibold text-red-500'>2.820.000đ</p>
                    </div>

                    <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <input type='checkbox' className='mr-2' />
                            <img
                                src='https://cdn1.concung.com/storage/2023/03/1677841224-bubs-supreme-junior3.png'
                                alt='Abbott Ensure Gold'
                                className='w-16 h-16 rounded-lg'
                            />
                            <div className='ml-4'>
                                <p className='font-semibold'>Abbott Ensure Gold</p>
                                <div className="flex gap-x-0 mt-2">
                                    <button
                                        className="bg-[#E5E9EB] w-6 py-1 rounded-l-full font-bold"
                                        onClick={() => handleDecrement(setQuantity2)}
                                    >
                                        <MinusOutlined />
                                    </button>
                                    <p className="bg-[#E5E9EB] text-center py-1 w-5">
                                        {quantity2}
                                    </p>
                                    <button
                                        className="bg-[#E5E9EB] w-6 py-1 rounded-r-full font-bold"
                                        onClick={() => handleIncrement(setQuantity2)}
                                    >
                                        <PlusOutlined />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className='font-semibold text-red-500'>2.820.000đ</p>
                    </div>
                </div>
                <div className='flex justify-end gap-7 mt-4'>
                    <button className='bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600' onClick={() => nav('/purchase/request-return/reason')}>
                        Tiếp tục
                    </button>
                    <p className='font-semibold text-xl'>Tổng: <span className='text-red-500'>5.640.000đ</span></p>
                </div>
            </div>


        </div >
    );
};

export default RequestReturn;
