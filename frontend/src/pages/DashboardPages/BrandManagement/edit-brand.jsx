import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Modal } from "antd";
import { useForm, Controller } from "react-hook-form";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "@/constants/apiConfig";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const { Option } = Select;

const EditBrand = ({
  brand,
  onEditSuccess,
  setFilteredData,
  filteredData,
}) => {
  const token = useSelector((state) => state.auth.token);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onFinish = async (data) => {
    console.log("Form data for update:", data);
    const response = await axios.put(
      `${BASE_URL}/api/brand/${brand._id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setFilteredData((prevData) =>
        prevData.map((item) =>
          item._id === response.data._id ? response.data : item
        )
      );
      console.log("setFilteredData in edit product", filteredData);
    console.log("API response:", response.data);
    toast.success("Update brand successfully!", {
      position: "top-right",
    });
    onEditSuccess();
    handleCancel();
  };

  const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);

  const showEditModal = () => {
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
  };

  return (
    <>
      <Button
        value="edit"
        type="primary"
        icon={<EditOutlined />}
        onClick={showEditModal}
      />
      <Modal
        title="Edit Brand"
        visible={isEditModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit(onFinish)}>
            Submit
          </Button>,
        ]}
      >
        <Form layout="vertical" onFinish={handleSubmit(onFinish)}>
          <Form.Item
            label="Brand Name"
            name="brand_name"
            rules={[{ required: true, message: "Please enter brand name" }]}
          >
            <Controller
              control={control}
              name="brand_name"
              defaultValue={brand?.brand_name}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          {errors.brand_name && (
            <p className="text-red-600">{errors.brand_name.message}</p>
          )}

        </Form>
      </Modal>
    </>
  );
};

export default EditBrand;
