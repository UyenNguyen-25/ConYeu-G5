/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Table, Button, Radio, Modal } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "@/constants/apiConfig";
import EditProduct from "./edit-product";
import { toast } from "sonner";
import DetailProduct from "./detail-product";

const TableProduct = ({ showEditModal, filteredData, setFilteredData }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // State cho trạng thái modal
  const [deleteLoading, setDeleteLoading] = useState(false); // State cho trạng thái xóa sản phẩm
  const [deleteProductId, setDeleteProductId] = useState(null);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/product/get-all-product`
      );
      setProducts(response.data);
      setFilteredData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  console.log("products in table", products);

  const columns = [
    {
      title: "Image",
      dataIndex: "product_img",
      key: "product_img",
      render: (text) => (
        <img
          src={text}
          alt="Product"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Brand",
      dataIndex: "product_brand_id",
      key: "product_brand_id",
      render: (text) => text.brand_name,
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      sorter: (a, b) => a.product_name.localeCompare(b.product_name),
    },
    {
      title: "For Age",
      dataIndex: "product_age",
      key: "product_age",
      sorter: (a, b) => a.product_age.localeCompare(b.product_age),
    },
    {
      title: "Category",
      dataIndex: "product_type",
      key: "product_type",
      render: (text) => getTypeName(text),
      sorter: (a, b) => a.product_type.localeCompare(b.product_type),
    },
    {
      title: "Price",
      dataIndex: "product_price",
      key: "product_price",
      render: (text) => formatter.format(text),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Radio.Group className="flex gap-2">
          <EditProduct
            product={record}
            onEditSuccess={fetchProducts}
            setFilteredData={setFilteredData}
            filteredData={filteredData}
          />
          <DetailProduct product={record} />
          {/* <Button
            value="delete"
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record._id)}
            loading={deleteLoading && deleteProductId === record._id}
          /> */}
        </Radio.Group>
      ),
    },
  ];

  const showDeleteConfirm = (productId) => {
    Modal.confirm({
      title: "Are you sure delete this product?",
      icon: <DeleteOutlined />,
      content: "This action cannot be undone",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleDeleteProduct(productId),
    });
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setDeleteLoading(true);
      await axios.delete(`${BASE_URL}/api/product/delete-product/${productId}`);
      toast.success("Update product successfully!", {
        position: "top-right",
      });
      // fetchProducts()
      const updatedProducts = products.filter(
        (product) => product._id !== productId
      );
      setProducts(updatedProducts);
      setFilteredData(updatedProducts);
      setDeleteLoading(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={filteredData}
        className="rounded-lg shadow"
        key={Math.random()}
      />
    </div>
  );
};

export default TableProduct;
