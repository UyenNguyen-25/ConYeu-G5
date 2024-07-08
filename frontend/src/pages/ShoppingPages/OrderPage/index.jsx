import { Tabs } from 'antd'
import React from 'react'
import PendingOrder from './OrderTracking/PendingOrder'
import ProcessingOrder from './OrderTracking/ProcessingOrder'
import CompletedOrder from './OrderTracking/CompletedOrder'
import CanceledOrder from './OrderTracking/CanceledOrder'
import ReturnedOrder from './OrderTracking/ReturnedOrder'
import DeliveringOrder from './OrderTracking/DeliveringOrder'

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
            children: <ProcessingOrder/>,
          },
          {
            label: 'Đang Giao',
            key: '3',
            children: <DeliveringOrder/>,
          },
          {
            label: 'Đã Giao',
            key: '4',
            children: <CompletedOrder/>,
          },
          {
            label: 'Đã Hủy',
            key: '5',
            children: <CanceledOrder/>,
          },
          {
            label: 'Trả Hàng',
            key: '6',
            children: <ReturnedOrder/>,
          },
        ]}
      />
    </div>
  )
}

export default index