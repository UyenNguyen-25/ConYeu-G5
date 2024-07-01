import React from "react";
import { Modal, Descriptions, Button } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { BASE_URL } from "@/constants/apiConfig";
import axios from "axios";
import { toast } from "sonner";

const DetailProduct = ({ product }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const formatter = new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "VND",
  });

  const getTypeName = (type) => {
    switch (type) {
      case "type1":
        return "Sữa bột pha sẳn";
      case "type2":
        return "Sữa bột công thức";
      case "type3":
        return "Sữa tươi";
      case "type4":
        return "Sữa hạt dinh dưỡng";
      default:
        return type;
    }
  };

  const showDetailModal = () => {
    setIsModalVisible(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button
        value="edit"
        type="primary"
        icon={<EyeOutlined />}
        onClick={showDetailModal}
      />
      <Modal
        title="Product Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        loading={loading}
      >
        {product && (
          <Descriptions bordered>
            <Descriptions.Item label="Product Name">
              {product?.product_name}
            </Descriptions.Item>
            <Descriptions.Item label="Brand">
              {product?.product_brand_id?.brand_name}
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              {getTypeName(product?.product_type)}
            </Descriptions.Item>
            <Descriptions.Item label="For Age">
              {product?.product_age}
            </Descriptions.Item>
            <Descriptions.Item label="Price">
              {formatter.format(product?.product_price)}
            </Descriptions.Item>
            <Descriptions.Item label="Quantity">
              {product?.quantity}
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={3}>
              {product?.product_description}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {product?.product_status?.product_status_description}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};

export default DetailProduct;
