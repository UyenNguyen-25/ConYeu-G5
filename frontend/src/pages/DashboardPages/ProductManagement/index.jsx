import { useEffect, useState } from "react";
import { Button, Input, Form, Select } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import AddProduct from "./components/add-product";
import TableProduct from "./components/table";
import axios from "axios";
import { BASE_URL } from "@/constants/apiConfig";

const { Search } = Input;
const { Option } = Select;

const ProductManagement = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/product/get-all-product`
        );
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setIsEditModalVisible(true);
    setSelectedProduct(record);
  };

  const handleFilter = (values) => {
    const { product_age, category } = values;
    console.log(values);
    let filtered = data;
    if (product_age) {
      filtered = filtered.filter((item) => item.product_age === product_age);
    }
    if (category) {
      filtered = filtered.filter((item) => item.product_type === category);
    }
    setFilteredData(filtered);
  };
  console.log("filtered", filteredData);

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.product_name.toLowerCase().includes(searchValue) ||
        item.product_type.toLowerCase().includes(searchValue)
    );
    setFilteredData(filtered);
  };
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4 w-full">
          <Search
            placeholder="Search by product name or category..."
            enterButton={<SearchOutlined />}
            className="w-1/3"
            onSearch={handleSearch}
          />
          {/* Filter */}
          <Form layout="inline" onFinish={handleFilter}>
            <Form.Item name="product_age">
              <Select placeholder="Filter by age" style={{ width: 150 }}>
                <Option value="0-1">0-1</Option>
                <Option value="1-2">1-2</Option>
                <Option value="2-3">2-3</Option>
                <Option value="suabau">Sữa bầu</Option>
              </Select>
            </Form.Item>
            <Form.Item name="category">
              <Select placeholder="Filter by category" style={{ width: 150 }}>
                <Option value="type1">Sữa bột pha sẳn</Option>
                <Option value="type2">Sữa bột công thức</Option>
                <Option value="type3">Sữa tươi</Option>
                <Option value="type4">Sữa hạt dinh dưỡng</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type="default"
                icon={<FilterOutlined />}
                htmlType="submit"
              >
                Filter
              </Button>
            </Form.Item>
          </Form>
        </div>
        <AddProduct setFilteredData={setFilteredData} />
      </div>

      <TableProduct
        showEditModal={showEditModal}
        filteredData={filteredData.length > 0 ? filteredData : data}
        setFilteredData={setFilteredData}
      />
    </>
  );
};

export default ProductManagement;
