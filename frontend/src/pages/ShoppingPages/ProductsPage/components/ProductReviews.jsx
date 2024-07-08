import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button } from 'antd';
import React, { useState } from 'react';
import StarRating from './StarRating';

const ProductReviews = ({ product }) => {
    const [filter, setFilter] = useState(0);
    console.log('productttttttttttttttt', product)

    const filteredFeedbacks = filter === 0
        ? product.feedback_id
        : product.feedback_id.filter(feedback => feedback.feedback_rating === filter);

    const averageRating = product.feedback_id?.length > 0
        ? product.feedback_id.reduce((acc, feedback) => acc + feedback.feedback_rating, 0) / product.feedback_id.length
        : 0;

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="bg-[#E7F3FF] py-4 pl-7 text-2xl font-bold mt-5">
                ĐÁNH GIÁ SẢN PHẨM
            </div>
            {product.feedback_id?.length > 0 ? (
                <div className='flex gap-16'>
                    <div className=''>
                        <div className="flex items-center mt-3">
                            <p className="text-4xl text-red-600">{averageRating.toFixed(1)}</p>
                            <p className="text-xl text-red-600 ml-2">trên 5</p>
                        </div>
                        <div className="flex items-center mt-2">
                            <div className="flex">
                                {[...Array(5)].map((_, index) => (
                                    <svg
                                        key={index}
                                        className={`h-6 w-6 ${index < averageRating ? 'text-yellow-500' : 'text-gray-300'}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 .288l2.833 8.718H24l-7.167 5.25 2.833 8.718L12 17.426 4.5 23l2.833-8.718L0 8.706h9.167z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-xl text-red-600 ml-2">({product.feedback_id?.length})</span>
                        </div>
                    </div>
                    <div className="flex mt-12 space-x-2">
                        <Button className={filter === 0 ? "bg-red-600 text-white" : "bg-gray-200"} onClick={() => setFilter(0)}>Tất Cả</Button>
                        <Button className={filter === 5 ? "bg-red-600 text-white" : "bg-gray-200"} onClick={() => setFilter(5)}>5 Sao</Button>
                        <Button className={filter === 4 ? "bg-red-600 text-white" : "bg-gray-200"} onClick={() => setFilter(4)}>4 Sao</Button>
                        <Button className={filter === 3 ? "bg-red-600 text-white" : "bg-gray-200"} onClick={() => setFilter(3)}>3 Sao</Button>
                        <Button className={filter === 2 ? "bg-red-600 text-white" : "bg-gray-200"} onClick={() => setFilter(2)}>2 Sao</Button>
                        <Button className={filter === 1 ? "bg-red-600 text-white" : "bg-gray-200"} onClick={() => setFilter(1)}>1 Sao</Button>
                    </div>
                </div>
            ) : (
                <div className='text-center mt-5 text-gray-500'>Chưa có đánh giá</div>
            )}
            {filteredFeedbacks?.length > 0 && (
                filteredFeedbacks.map(feedback => (
                    <div className="mt-5" key={feedback._id}>
                        <div className="border-t py-4">
                            <div className="flex gap-4">
                                <Avatar size="default" icon={<UserOutlined />} />
                                <div>
                                    <p className="text-lg font-bold">r*****7</p>
                                    <StarRating rating={feedback.feedback_rating} />
                                    <p className="text-gray-500 mt-2">{new Date(feedback.createdAt).toLocaleString()}</p>
                                    <p className="mt-2">{feedback.feedback_description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductReviews;
