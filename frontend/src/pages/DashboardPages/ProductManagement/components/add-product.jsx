import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Modal } from "antd";
import { useForm, Controller } from "react-hook-form";
import { PlusCircleFilled, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "@/constants/apiConfig";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const { Option } = Select;

const AddProduct = ({ setFilteredData }) => {
  const token = useSelector((state) => state.auth.token);
  const [productStatus, setProductStatus] = useState([]);
  const [brands, setBrands] = useState([]);
  const [postImage, setPostImage] = useState({
    myFile: null,
    base64String: "",
  });
  const [form] = Form.useForm();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchProductStatus = async () => {
      try {
        const productStatus = await axios.get(
          `${BASE_URL}/api/product/get-product-status`
        );
        setProductStatus(productStatus.data);
      } catch (error) {
        console.error("Error fetching product status", error);
      }
    };
    fetchProductStatus();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brands = await axios.get(`${BASE_URL}/api/brand/get-all-brand`);
        setBrands(brands.data);
      } catch (error) {
        console.error("Error fetching brand", error);
      }
    };
    fetchBrands();
  }, []);

  const onFinish = async (data) => {
    const formData = {
      ...data,
      product_img: postImage.base64String,
    };
    // const validFields = await form.validateFields();
    //   const Data = {
    //     product_name: validFields?.product_name,
    //     product_type: validFields?.product_type,
    //     product_brand_id: validFields?.product_brand_id,
    //     product_age: validFields?.product_age,
    //     product_price: validFields?.product_price,
    //     quantity: validFields.quantity,
    //     product_description: validFields.product_description,
    //     product_status: validFields.product_status,
    //     product_img: validFields.product_img
    //   };
    // console.log("form data", Data);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/product/create-product`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("API response:", response);
      // message.success('Product created successfully!');
      // console.log('Form data:', formData);
      setFilteredData((prevData) => [...prevData, response.data.data]);
      toast.success("Thêm mới sản phẩm thành công!", {
        position: "top-right",
      });
      handleCancel();
    } catch (error) {
      console.log(error);
      toast.error("Thêm mới sản phẩm thất bại!", {
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

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setPostImage({
      myFile: file,
      base64String: base64,
    });
  };

  return (
    <>
      <Button type="primary" icon={<PlusCircleFilled />} onClick={showModal}>
        Add Product
      </Button>
      <Modal
        title="Add Product"
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
            label="Product Name"
            name="product_name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Controller
              control={control}
              name="product_name"
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          {errors.product_name && (
            <p className="text-red-600">{errors.product_name.message}</p>
          )}

          <Form.Item
            label="Product Type"
            name="product_type"
            rules={[{ required: true, message: "Please select product type" }]}
          >
            <Controller
              control={control}
              name="product_type"
              render={({ field }) => (
                <Select {...field} placeholder="Select type">
                  <Option value="type1">Sữa bột pha sẳn</Option>
                  <Option value="type2">Sữa bột công thức</Option>
                  <Option value="type3">Sữa tươi</Option>
                  <Option value="type4">Sữa hạt dinh dưỡng</Option>
                </Select>
              )}
            />
          </Form.Item>

          {errors.product_type && (
            <p className="text-red-600">{errors.product_type.message}</p>
          )}

          <Form.Item
            name="product_brand_id"
            label="Product Brand"
            rules={[{ required: true, message: "Please enter product brand" }]}
          >
            <Controller
              control={control}
              name="product_brand_id"
              render={({ field }) => (
                <Select {...field} placeholder="Select brand">
                  {brands.map((brand) => (
                    <Option key={brand} value={brand?._id}>
                      {brand?.brand_name}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>
          {errors.product_type && (
            <p className="text-red-600">{errors.product_type.message}</p>
          )}

          <Form.Item
            name="product_age"
            label="Age"
            rules={[{ required: true, message: "Please select age" }]}
          >
            <Controller
              control={control}
              name="product_age"
              render={({ field }) => (
                <Select {...field} placeholder="Select age">
                  <Option value="0-1">0-1</Option>
                  <Option value="1-2">1-2</Option>
                  <Option value="2-3">2-3</Option>
                  <Option value="suabau">Sữa bầu</Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Product Price"
            name="product_price"
            rules={[{ required: true, message: "Please enter product price" }]}
          >
            <Controller
              control={control}
              name="product_price"
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  onBlur={(e) => field.onChange(parseInt(e.target.value, 10))}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
              )}
            />
          </Form.Item>

          <Form.Item name="product_price_discount" label="Price Discount">
            <Controller
              control={control}
              name="product_price_discount"
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  onBlur={(e) => field.onChange(parseInt(e.target.value, 10))}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[
              { required: true, message: "Please enter quantity of product" },
            ]}
          >
            <Controller
              control={control}
              name="quantity"
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  onBlur={(e) => field.onChange(parseInt(e.target.value, 10))}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
              )}
              defaultValue=""
            />
          </Form.Item>
          {errors.quantity && (
            <p className="text-red-600">{errors.quantity.message}</p>
          )}

          <Form.Item
            label="Product Description"
            name="product_description"
            rules={[
              { required: true, message: "Please enter product description" },
            ]}
          >
            <Controller
              control={control}
              name="product_description"
              render={({ field }) => <Input.TextArea {...field} />}
            />
          </Form.Item>

          {errors.product_description && (
            <p className="text-red-600">{errors.product_description.message}</p>
          )}

          <Form.Item
            name="product_status"
            label="Product Status"
            rules={[{ required: true, message: "Please enter product status" }]}
          >
            <Controller
              control={control}
              name="product_status"
              render={({ field }) => (
                <Select {...field} placeholder="Select status">
                  {productStatus.map((status) => (
                    <Option key={status.id} value={status._id}>
                      {status.product_status_description}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>
          {errors.product_status && (
            <p className="text-red-600">{errors.product_status.message}</p>
          )}

          <Form.Item
            name="product_img"
            label="Image of Product (*.jpg, *.png)"
            rules={[{ message: "Please upload image" }]}
          >
            <input
              type="file"
              name="product_img"
              onChange={(e) => handleFileUpload(e)}
              accept=".jpeg, .png, .jpg"
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="custom-file-upload">
              <img
                src={postImage.myFile ? postImage.base64String : null}
                alt="Selected Product"
              />
              <UploadOutlined /> Select File
            </label>
          </Form.Item>
          {errors.product_img && (
            <p className="text-red-600">{errors.product_img.message}</p>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default AddProduct;
