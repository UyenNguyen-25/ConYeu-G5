import React, { useState } from 'react'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Flex, message, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const ReasonReturn = () => {
    const nav = useNavigate();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([])
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );
    return (
        <div className=' min-h-screen flex flex-col items-center py-10'>
            <div className='mb-6 mr-auto ml-12'>
                <button className='bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300' onClick={() => nav('/purchase/request-return')}>
                    &lt; Trở về
                </button>
            </div>
            <div className='bg-white p-7 rounded-lg mb-6 w-1/2'>
                <p className='font-bold'>Chúng tôi có thể giúp gì cho ba mẹ?</p>
                <p className='mt-4'>Tôi đã nhận tất cả hàng nhưng chúng có vấn đề</p>

            </div>
            <div className='bg-white p-7 rounded-lg mb-6 w-1/2 flex flex-col gap-4'>
                <p className='font-bold'>Sản phẩm ba mẹ muốn trả</p>
                <div className='flex'>
                    <img
                        src='https://cdn1.concung.com/storage/2023/03/1677841224-bubs-supreme-junior3.png'
                        alt='Combo 4 Nutren Junior'
                        className='w-20 h-20 rounded-lg'
                    />
                    <img
                        src='https://cdn1.concung.com/storage/2023/03/1677841224-bubs-supreme-junior3.png'
                        alt='Combo 4 Nutren Junior'
                        className='w-20 h-20 rounded-lg'
                    />
                </div>
            </div>
            <div className='bg-white p-7 rounded-lg mb-6 w-1/2 flex flex-row'>
                <div className='basis-1/2'>
                    <p className='font-bold'>Tại sao ba mẹ muốn trả?</p>
                    <div className='flex flex-col mt-4 gap-3'>
                        <div className='flex gap-3'>
                            <input type='checkbox' /> <span>Sản phẩm bị hư hỏng hoặc hết hạn</span>
                        </div>
                        <div className='flex gap-3'>
                            <input type='checkbox' /> <span>Bao bì bị hỏng</span>
                        </div>
                        <div className='flex gap-3'>
                            <input type='checkbox' /> <span>Sản phẩm bị làm giả</span>
                        </div>
                    </div>
                </div>
                <div className='basis-1/2'>
                    <p className='font-semibold mb-3'>Cung cấp hình ảnh</p>
                    <>
                        <Upload
                            // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                        >
                            {fileList.length >= 8 ? null : uploadButton}
                        </Upload>
                        {previewImage && (
                            <Image
                                wrapperStyle={{
                                    display: 'none',
                                }}
                                preview={{
                                    visible: previewOpen,
                                    onVisibleChange: (visible) => setPreviewOpen(visible),
                                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                }}
                                src={previewImage}
                            />
                        )}
                    </>
                </div>
            </div>
            <div className='bg-white p-7 rounded-lg mb-6 w-1/2'>
                <p className='font-bold mb-4'>Chi tiết trả hàng</p>
                {/* <p className='mt-4'>Số tiền hoàn trả</p>
                <p className='mt-4'>Hoàn trả bằng</p> */}
                <div className='border-t pt-4 flex flex-col gap-5'>
                    <div className='flex justify-between'>
                        <p>Số tiền hoàn trả</p>
                        <p>$159.98</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Hoàn trả bằng</p>
                        <p>Tiền mặt</p>
                    </div>
                    <div className='flex justify-between'>
                        <p></p>
                        <button className='bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 w-[150px]'>
                        Xác nhận
                    </button>
                    </div>
                    
                </div>

            </div>
        </div>
    )
}

export default ReasonReturn