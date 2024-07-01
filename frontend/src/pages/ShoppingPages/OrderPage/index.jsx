import { Tabs } from 'antd'
import React from 'react'
import PendingOrder from './OrderTracking/PendingOrder'
import PreparingOrder from './OrderTracking/PreparingOrder'
import DeliveriedOrder from './OrderTracking/DeliveriedOrder'
import CanceledOrder from './OrderTracking/CanceledOrder'
import ReturnedOrder from './OrderTracking/ReturnedOrder'

const index = () => {
  return (
    <div className='bg-white px-20 py-6 mx-20 my-7 rounded-lg'>
      <Tabs
      className='w-full'
        defaultActiveKey="1"
        items={[
          {
            label: 'Chờ Xác Nhận',
            key: '1',
            children: <PendingOrder/>,
          },
          {
            label: 'Chờ Giao',
            key: '2',
            children: <PreparingOrder/>,
          },
          {
            label: 'Đã Giao',
            key: '3',
            children: <DeliveriedOrder/>,
          },
          {
            label: 'Đã Hủy',
            key: '4',
            children: <CanceledOrder/>,
          },
          {
            label: 'Trả Hàng',
            key: '5',
            children: <ReturnedOrder/>,
          },
        ]}
      />
    </div>
  )
}

export default index