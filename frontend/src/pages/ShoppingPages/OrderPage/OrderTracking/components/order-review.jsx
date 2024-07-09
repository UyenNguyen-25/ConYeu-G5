import React, { useState, useEffect } from 'react';
import { Modal, Rate, Input, Button } from 'antd';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';

const OrderReview = ({ orderItems, visible, onCancel, onOk }) => {
  const userDetail = useSelector(selectCurrentUser);
  const [feedbackData, setFeedbackData] = useState([]);
  console.log('feedbackData', feedbackData)

  useEffect(() => {
    setFeedbackData(
      orderItems.map(item => ({
        order_items_id: item._id,
        feedback_rating: 5,
        feedback_description: '',
        user_id: userDetail.user_id
      }))
    );
  }, [orderItems]);

  const handleRatingChange = (index, rating) => {
    const newFeedbackData = [...feedbackData];
    if (newFeedbackData[index]) {
      newFeedbackData[index].feedback_rating = rating;
      setFeedbackData(newFeedbackData);
    }
  };

  const handleDescriptionChange = (index, description) => {
    const newFeedbackData = [...feedbackData];
    if (newFeedbackData[index]) {
      newFeedbackData[index].feedback_description = description;
      setFeedbackData(newFeedbackData);
    }
  };

  const handleOkClick = () => {
    onOk(feedbackData);
  };

  return (
    <Modal
      title="Đánh Giá Sản Phẩm"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Trở Lại
        </Button>,
        <Button key="submit" type="primary" onClick={handleOkClick}>
          Hoàn Thành
        </Button>,
      ]}
    >
      {orderItems.map((item, index) => (
        <div key={item._id} className="mb-4">
          <div className="flex items-center mb-4">
            <img className="w-20 h-20" src={item.product?.product.product_img || 'path-to-image'} alt="product" />
            <div className="ml-4">
              <p className="font-semibold">{item.product?.product.product_name || 'Product name'}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="font-semibold">Chất lượng sản phẩm</p>
            <Rate
              onChange={(value) => handleRatingChange(index, value)}
              value={feedbackData[index]?.feedback_rating}
            />
            <span className="ml-2">
              {feedbackData[index]?.feedback_rating === 5 ? 'Tuyệt vời' :
                feedbackData[index]?.feedback_rating === 4 ? 'Hài lòng' :
                  feedbackData[index]?.feedback_rating === 3 ? 'Bình thường' :
                    feedbackData[index]?.feedback_rating === 2 ? 'Không hài lòng' :
                      feedbackData[index]?.feedback_rating === 1 ? 'Tệ' : 'Chưa đánh giá'}
            </span>

          </div>

          <div className="mb-4">
            <p className="font-semibold">Chất lượng sản phẩm:</p>
            <Input.TextArea
              value={feedbackData[index]?.feedback_description}
              onChange={e => handleDescriptionChange(index, e.target.value)}
              placeholder="Để lại đánh giá nhé"
              rows={4}
            />
          </div>
        </div>
      ))}
    </Modal>
  );
};

export default OrderReview;
