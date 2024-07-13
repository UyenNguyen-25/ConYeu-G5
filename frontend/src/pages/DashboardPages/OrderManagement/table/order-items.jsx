import { BASE_URL } from '@/constants/apiConfig';
import axios from 'axios';
import { useEffect, useState } from 'react';

const OrderItems = ({ orderDetails, formatter }) => {
    const [products, setProducts] = useState({});

    const fetchProductDetails = async (productIds) => {
        try {
            const responses = await Promise.all(
                productIds.map((productId) =>
                    axios.get(`${BASE_URL}/api/product/get-product-by-id/${productId}`)
                )
            );

            const productDetails = responses.reduce((acc, response) => {
                const product = response.data.product;
                // console.log('product', product)
                acc[product._id] = product;
                return acc;
            }, {});

            setProducts(productDetails);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    useEffect(() => {
        const productIds = orderDetails.order_items.map((item) => item.product_id);
        fetchProductDetails(productIds);
    }, [orderDetails])

    return (
        <div className='my-6'>
            {orderDetails ?
                <div className='flex flex-row gap-8'>
                    <div className='flex-1'>
                        {orderDetails.order_items.map((item) => (
                            <div key={item._id} className='flex justify-between mb-4'>
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
                    </div>
                </div> : <>No Data</>}
        </div>
    )
}

export default OrderItems