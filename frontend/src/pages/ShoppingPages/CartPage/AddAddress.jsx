import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

// import { Label } from "@radix-ui/react-dropdown-menu";
// import { Input } from "@/components/ui/input";
import { Controller, useForm } from 'react-hook-form';
// import { Checkbox } from 'antd';
import { Checkbox, Form, Input, Select, Button, Modal } from "antd";
import { apiGetPublicDistrict, apiGetPublicProvinces, apiGetPublicTown } from './ApiProvince';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { BASE_URL } from '@/constants/apiConfig';
import { MapPin } from 'lucide-react';

const AddAddress = ({ setShippingAddress }) => {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [province, setProvince] = useState('')
    const [district, setDistrict] = useState('')
    const [reset, setReset] = useState(false)
    const [field, setField] = useState({});
    const [town, setTown] = useState('');
    const [towns, setTowns] = useState([]);
    const userDetail = useSelector(selectCurrentUser);
    const token = useSelector((state) => state.auth.token);

    const { handleSubmit, control, formState: { errors }, setValue } = useForm();

    useEffect(() => {
        const fetchPublicProvinces = async () => {
            try {
                const response = await apiGetPublicProvinces();
                if (response.status === 200) {
                    setProvinces(response.data.results);
                }
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };
        fetchPublicProvinces();
    }, []);
    useEffect(() => {
        const fetchPublicDistricts = async () => {
            if (province) {
                try {
                    const response = await apiGetPublicDistrict(province);
                    if (response.status === 200) {
                        setDistricts(response.data.results);
                    }
                } catch (error) {
                    console.error('Error fetching districts:', error);
                }
            } else {
                setDistricts([]);
            }
        };
        fetchPublicDistricts();
    }, [province]);

    useEffect(() => {
        const fetchPublicTowns = async () => {
            if (district) {
                try {
                    const response = await apiGetPublicTown(district);
                    if (response.status === 200) {
                        setTowns(response.data.results);
                    }
                } catch (error) {
                    console.error('Error fetching towns:', error);
                }
            } else {
                setTowns([]);
            }
        };
        fetchPublicTowns();
    }, [district]);

    const onFinish = async (data) => {
        const formData = {
            name: data.name,
            phone: data.phone,
            remember: data.remember,
            fullAddress: `${data.address}, ${findTownNameById(data.town)}, ${findDistrictNameById(data.district)}, ${findProvinceNameById(data.province)}`
        };
        localStorage.setItem('shippingAddress', JSON.stringify(formData));
        console.log('Form data address:', formData);
        // setIsModalVisible(false);
        setShippingAddress(formData)

        try {
            const response = await axios.put(`${BASE_URL}/api/user/confirm-user-address`, {
                user_id: userDetail.user_id,
                address: formData.fullAddress,
                fullname: formData.name,
                phoneNumber: formData.phone,
                default: formData.remember,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('API response:', response.data);
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error confirming user address:', error);
        }
    };

    const handleProvinceChange = (value) => {
        setProvince(value);
        setValue('province', value);
    };

    const handleDistrictChange = (value) => {
        setDistrict(value);
        setValue('district', value);
    };

    const handleTownChange = (value) => {
        setTown(value);
        setValue('town', value);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const findProvinceNameById = (provinceId) => {
        const province = provinces.find(prov => prov.province_id === provinceId);
        return province ? province.province_name : '';
    };

    const findDistrictNameById = (districtId) => {
        const district = districts.find(dist => dist.district_id === districtId);
        return district ? district.district_name : '';
    };

    const findTownNameById = (townId) => {
        const town = towns.find(town => town.ward_id === townId);
        return town ? town.ward_name : '';
    };

    return (
        <>
            <Button type="primary" className='bg-orange-600 text-white flex gap-2 h-14 justify-center items-center hover:bg-orange-400' onClick={showModal}>
                <MapPin />XÁC NHẬN ĐỊA CHỈ NHẬN HÀNG
            </Button>
            <Modal
                title="Thêm Mới Địa Chỉ Nhận Hàng"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSubmit(onFinish)}>
                        Xác nhận
                    </Button>,
                ]}
            >
                <Form
                    layout="vertical"
                    onFinish={handleSubmit(onFinish)}
                >
                    <Form.Item
                        label="Họ và tên"
                        name="name"
                        rules={[
                            { required: true, message: 'Hãy nhập họ và tên!' },
                            {
                                pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                                message: "Chỉ nhập chữ",
                            },]}
                    >
                        <Controller
                            control={control}
                            name="name"
                            render={({ field }) => <Input {...field} />}
                        />
                    </Form.Item>

                    {errors.name && <p className='text-red-600'>{errors.name.message}</p>}

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            { required: true, message: 'Hãy nhập số điện thoại!' },
                            {
                                pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                                message: "Hãy nhập chính xác số điện thoại",
                            },]}
                    >
                        <Controller
                            control={control}
                            name="phone"
                            render={({ field }) => <Input {...field} />}
                        />
                    </Form.Item>

                    {errors.phone && <p className='text-red-600'>{errors.phone.message}</p>}

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[
                            { required: true, message: 'Hãy nhập địa chỉ!' },
                            {
                                pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                                message: "Chỉ nhập chữ",
                            }]}
                    >
                        <Controller
                            control={control}
                            name="address"
                            render={({ field }) => <Input {...field} />}
                        />
                    </Form.Item>
                    {errors.address && <p className='text-red-600'>{errors.address.message}</p>}

                    <Form.Item
                        label="Tỉnh/ Thành phố"
                        name="province"
                        rules={[{ required: true, message: 'Hãy chọn Tỉnh/ Thành phố!' }]}
                    >
                        <Controller
                            control={control}
                            name="province"
                            render={({ field }) => (
                                <Select {...field} placeholder="Hãy chọn Tỉnh/ Thành phố" value={province} onChange={handleProvinceChange}>
                                    {provinces.map((prov) => (
                                        <Select.Option key={prov.province_id} value={prov.province_id}>
                                            {prov.province_name}
                                        </Select.Option>

                                    ))}
                                </Select>
                            )}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Quận/ Huyện"
                        name="district"
                        rules={[{ required: true, message: 'Hãy chọn Quận/ Huyện!' }]}
                    >
                        <Controller
                            control={control}
                            name="district"
                            render={({ field }) => (
                                <Select {...field} placeholder="Hãy chọn Quận/ Huyện!" value={district} onChange={handleDistrictChange}>
                                    {districts.map((dist) => (
                                        <Select.Option key={dist.district_id} value={dist.district_id}>
                                            {dist.district_name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Phường/ Xã"
                        name="town"
                        rules={[{ required: true, message: 'Hãy chọn Phường/ Xã!' }]}
                    >
                        <Controller
                            control={control}
                            name="town"
                            render={({ field }) => (
                                <Select {...field} placeholder="Hãy chọn Phường/ Xã!" value={town} onChange={handleTownChange}>
                                    {towns.map((town) => (
                                        <Select.Option key={town.ward_id} value={town.ward_id}>
                                            {town.ward_name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )}
                        />
                    </Form.Item>

                    <Form.Item
                        name="remember"
                        valuePropName="unchecked"
                        wrapperCol={{ offset: 8, span: 16 }}
                        className='col-start-1 col-end-3'
                    >
                        <Controller
                            control={control}
                            name="remember"
                            render={({ field }) => <Checkbox>Địa chỉ mặc định</Checkbox>}
                            defaultValue=""
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default AddAddress