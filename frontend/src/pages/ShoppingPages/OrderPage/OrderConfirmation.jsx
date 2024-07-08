import React from 'react';
import { Result, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const OrderConfirmationPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('orderId');

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
                <Result
                    status="success"
                    title="Đặt hàng thành công!"
                    subTitle="Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận."
                    extra={[
                        <Button type="primary" key="go-home" className="mr-4">
                            <Link to="/" className="text-white">
                                Quay lại trang chủ
                            </Link>
                        </Button>,
                        <Button key="view-order">
                            <Link to={`/order/order-detail/${orderId}`}>Xem chi tiết đơn hàng</Link>
                        </Button>,
                    ]}
                />
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
