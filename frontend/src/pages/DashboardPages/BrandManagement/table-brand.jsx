import React, { useState, useEffect } from "react";
import { Table, Button, Radio, Modal } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "@/constants/apiConfig";
import { toast } from "sonner";
import EditBrand from "./edit-brand";
import { useSelector } from "react-redux";

const TableBrand = ({ showEditModal, filteredData, setFilteredData }) => {
    const token = useSelector((state) => state.auth.token);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteBrandId, setDeleteBrandId] = useState(null);

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
            const brandsWithProductsCount = await Promise.all(
                response.data.map(async (brand) => {
                    const productResponse = await axios.get(
                        `${BASE_URL}/api/brand/count-product-by-brand/${brand._id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    return {
                        ...brand,
                        num_products: productResponse.data.count,
                    };
                })
            );
            setBrands(brandsWithProductsCount);
            setFilteredData(brandsWithProductsCount);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };
    console.log('brand', brands)

    const columns = [
        {
            title: "Brand Name",
            dataIndex: "brand_name",
            key: "brand_name",
            sorter: (a, b) => a.brand_name.localeCompare(b.brand_name),
        },
        {
            title: "Number of Products",
            dataIndex: "num_products",
            key: "num_products",
            sorter: (a, b) => a.num_products - b.num_products
        },
        {
            title: "Action",
            key: "action",
            render: (text, record) => (
                <Radio.Group className="flex gap-2">
                    <EditBrand
                        brand={record}
                        onEditSuccess={fetchBrands}
                        setFilteredData={setFilteredData}
                        filteredData={filteredData}
                    />
                    <Button
                        value="delete"
                        icon={<DeleteOutlined />}
                        onClick={() => showDeleteConfirm(record._id)}
                        loading={deleteLoading && deleteBrandId === record._id}
                        disabled={record.num_products !== 0}
                    />
                </Radio.Group>
            ),
        },
    ];

    const showDeleteConfirm = (brandId) => {
        Modal.confirm({
            title: "Are you sure delete this brand?",
            icon: <DeleteOutlined />,
            content: "This action cannot be undone",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: () => handleDeleteBrand(brandId),
        });
    };

    const handleDeleteBrand = async (brandId) => {
        try {
            setDeleteLoading(true);
            const response = await axios.delete(
                `${BASE_URL}/api/brand/${brandId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success(response.data.message, {
                position: "top-right",
            });
            const updatedBrand = brands.filter(
                (brand) => brand._id !== brandId
            );
            setBrands(updatedBrand);
            setFilteredData(updatedBrand);
            setDeleteLoading(false);
        } catch (error) {
            toast.error(
                error.response.data.message || "Delete brand failed!",
                {
                    position: "top-right",
                }
            );
            setDeleteLoading(false);
        }
    };

    return (
        <div>
            <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading} // Display loading state while fetching data
                className="rounded-lg shadow"
                key={Math.random()}
            />
        </div>
    );
};

export default TableBrand;
