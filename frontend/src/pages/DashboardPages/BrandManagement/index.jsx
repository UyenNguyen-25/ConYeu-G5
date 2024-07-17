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
import axios from "axios";
import { BASE_URL } from "@/constants/apiConfig";
import TableBrand from "./table-brand";
import AddBrand from "./add-brand";
import { useSelector } from "react-redux";

const { Search } = Input;
const { Option } = Select;

const BrandManagement = () => {
    const [brands, setBrands] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const token = useSelector((state) => state.auth.token);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}/api/brand/get-all-brand`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setBrands(response.data);
            setFilteredData(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const showEditModal = (record) => {
        setIsEditModalVisible(true);
        setSelectedProduct(record);
    };

    const handleSearch = (value) => {
        const searchValue = value.toLowerCase();
        const filtered = brands.filter(
            (item) =>
                item.brand_name.toLowerCase().includes(searchValue)
        );
        setFilteredData(filtered);
    };
    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Brand Management</h2>
            <div className="flex justify-between items-center mb-4">
                <Search
                    placeholder="Search by brand name"
                    enterButton={<SearchOutlined />}
                    className="w-1/3"
                    onSearch={handleSearch}
                />
                <AddBrand setFilteredData={setFilteredData} />
            </div>


            <TableBrand
                showEditModal={showEditModal}
                filteredData={filteredData.length > 0 ? filteredData : brands}
                setFilteredData={setFilteredData}
            />
        </>
    );
};

export default BrandManagement;
