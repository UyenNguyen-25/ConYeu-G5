import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Modal } from "antd";
import { useForm, Controller } from "react-hook-form";
import { PlusCircleFilled, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "@/constants/apiConfig";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const { Option } = Select;

const AddBrand = ({ setFilteredData }) => {
  const token = useSelector((state) => state.auth.token);
  const [form] = Form.useForm();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onFinish = async (data) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/brand/create-brand`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("API response:", response);
      setFilteredData((prevData) => [...prevData, response.data.data]);
      toast.success("Add a brand successfully!", {
        position: "top-right",
      });
      handleCancel();
    } catch (error) {
      console.log(error);
      toast.error("Add a brand failed!", {
        position: "top-right",
      });
    }
    
  };

  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <>
      <Button type="primary" icon={<PlusCircleFilled />} onClick={showModal}>
        Add Brand
      </Button>
      <Modal
        title="Add Brand"
        visible={isModalVisible}
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
        <Form form={form} layout="vertical" onFinish={handleSubmit(onFinish)}>
          <Form.Item
            label="Brand Name"
            name="brand_name"
            rules={[{ required: true, message: "Please enter brand name" }]}
          >
            <Controller
              control={control}
              name="brand_name"
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

export default AddBrand;
