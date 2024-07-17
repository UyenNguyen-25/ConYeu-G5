import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const DoughnutChart = ({ soldProducts }) => {
  // Xử lý dữ liệu để trích xuất labels và data
  const labels = soldProducts.map(item => item._id);
  const data = soldProducts.map(item => item.totalQuantity);

  // Định nghĩa dữ liệu cho doughnut chart
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9933',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9933',
        ],
      },
    ],
  };

  return <Doughnut data={chartData} />;
};

export default DoughnutChart;
