import { BASE_URL } from "@/constants/apiConfig";
import { useGetUserQuery, useGetUsersQuery } from "@/redux/features/users/usersApiSlice";
import { Spin, Typography } from "antd";
import axios from "axios";
import { ArcElement, BarElement, CategoryScale, Legend, LinearScale, LineController, LineElement, PointElement, Title, Tooltip } from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import Chart from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Chart.register(ChartDataLabels);
Chart.register(
  LineController,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  ArcElement,
  Legend,
  Title,
)

const Dashboard = () => {
  const token = useSelector((state) => state.auth.token);
  const [user, setUser] = useState([]);
  const [order, setOrder] = useState([]);
  const [product, setProduct] = useState([]);
  const [brand, setBrand] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [doughnutData, setDoughnutData] = useState({});
  const [loading, setLoading] = useState({
    user: true,
    order: true,
    product: true,
    brand: true
  });
  const [isLoading, setIsLoading] = useState(true);
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
  const chart = () => {
    const labelList = orderData?.map((data) => data?._id?.month);
    const dataValue = orderData?.map((data) => data?.totalOrders);
    setChartData({
      labels: labelList,
      datasets: [
        {
          label: "Number of order ",
          data: dataValue,
          backgroundColor: [
            "#5932EA"
          ],
          borderWidth: 2
        }
      ]
    })

  };
  const chart2 = () => {
    setDoughnutData({
      labels: productData?.map(data => getTypeName(data?._id)),
      datasets: [
        {
          label: 'Sold Products by Type',
          data: productData?.map(data => data?.totalQuantity),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          borderWidth: 1,
        },
      ],
    });
  }
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/order/get-order-by-month`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrderData(response.data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/product/get-sold-product`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProductData(response.data)
      } catch (error) {
        console.error("Error fetching doughnut data:", error);
      }
    };

    fetchOrderData();
    fetchProductData();
  }, [token]);
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);

  useEffect(() => {
    const chartInstance = chartRef.current;

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [chartData]);
  useEffect(() => {
    const chartInstance2 = chartRef2.current;

    return () => {
      if (chartInstance2) {
        chartInstance2.destroy();
      }
    };
  }, [doughnutData]);


  useEffect(() => {
    chart();
  }, [orderData])
  useEffect(() => {
    chart2();
  }, [productData])

  useEffect(() => {
    const fetchData = async () => {
      setLoading({ user: true, order: true, product: true });

      try {
        const [userRes, orderRes, productRes, brandRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/user/get-all-user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${BASE_URL}/api/order/get-all-order`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${BASE_URL}/api/product/get-all-product`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${BASE_URL}/api/brand/get-all-brand`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setUser(userRes.data);
        setOrder(orderRes.data);
        setProduct(productRes.data);
        setBrand(brandRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false)
        setLoading({ user: false, order: false, product: false, brand: false });
      }
    };

    fetchData();
  }, [token]);

  return <div>
    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
    <div className="text-center mt-6">
      <div className="flex flex-row text-lg gap-6">
        <div className="basis-1/4 flex bg-white px-6 py-3 rounded-xl">
          <div className="flex flex-col">
            <div className="text-left ">Total User</div>
            <div className="text-left text-xl mt-1 font-semibold">{user.length}</div>
          </div>
          <div className="flex-grow"></div>
          <svg className="" width="79" height="82" viewBox="0 0 89 82" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.842657" fill-rule="evenodd" clip-rule="evenodd" d="M0 40.88V58.76C0 71.4625 10.2975 81.76 23 81.76H44.34H65.68C78.3825 81.76 88.68 71.4625 88.68 58.76V40.88V23C88.68 10.2975 78.3825 0 65.68 0H44.34H23C10.2975 0 0 10.2975 0 23V40.88Z" fill="#8280FF" />
            <path opacity="0.587821" fill-rule="evenodd" clip-rule="evenodd" d="M31.2375 31C31.2375 35.4183 34.5461 39 38.6275 39C42.7089 39 46.0175 35.4183 46.0175 31C46.0175 26.5817 42.7089 23 38.6275 23C34.5461 23 31.2375 26.5817 31.2375 31ZM49.7125 39C49.7125 42.3137 52.194 45 55.255 45C58.3161 45 60.7975 42.3137 60.7975 39C60.7975 35.6863 58.3161 33 55.255 33C52.194 33 49.7125 35.6863 49.7125 39Z" fill="white" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M38.5967 43C29.8739 43 22.7173 47.853 22.0012 57.3984C21.9622 57.9184 22.8807 59 23.3441 59H53.8633C55.2511 59 55.2727 57.7909 55.2511 57.4C54.7098 47.5864 47.4423 43 38.5967 43ZM54.518 47.001C56.8369 50.3434 58.2109 54.4979 58.211 58.9998H65.3349C66.3372 58.9998 66.3528 58.093 66.3372 57.7998C65.9505 50.5199 60.8116 47.0754 54.518 47.001Z" fill="white" />
          </svg>
        </div>
        <div className="basis-1/4 flex bg-white px-6 py-3 rounded-xl">
          <div className="flex flex-col">
            <div className="text-left ">Total Product</div>
            <div className="text-left text-xl mt-1 font-semibold">{product.length}</div>
          </div>
          <div className="flex-grow"></div>
          <svg width="83" height="82" viewBox="0 0 93 82" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.21" fill-rule="evenodd" clip-rule="evenodd" d="M0.43335 41.1181V59.0001C0.43335 71.7026 10.7308 82.0001 23.4334 82.0001H46.251H69.0687C81.7713 82.0001 92.0687 71.7026 92.0687 59V41.1181V23.2361C92.0687 10.5335 81.7712 0.236084 69.0687 0.236084H46.251H23.4333C10.7308 0.236084 0.43335 10.5336 0.43335 23.2361V41.1181Z" fill="#FEC53D" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M23.3422 33.3729L43.0445 43.5227C43.2567 43.632 43.4791 43.7109 43.7056 43.761V63.446L24.7473 53.4351C23.8764 52.9752 23.3422 52.1393 23.3422 51.2362V33.3729ZM69.16 33.1031V51.2363C69.16 52.1393 68.6257 52.9753 67.7548 53.4352L48.7965 63.4461V43.5886C48.8427 43.5681 48.8885 43.5461 48.9338 43.5227L69.16 33.1031Z" fill="#FEC53D" />
            <path opacity="0.499209" fill-rule="evenodd" clip-rule="evenodd" d="M23.9611 28.4466C24.2017 28.1755 24.5055 27.9463 24.8596 27.778L44.9048 18.2516C45.7463 17.8517 46.7557 17.8517 47.5972 18.2516L67.6424 27.778C67.9154 27.9077 68.1585 28.0737 68.3658 28.2671L46.3883 39.5889C46.2438 39.6633 46.1106 39.7485 45.9891 39.8427C45.8677 39.7485 45.7345 39.6633 45.59 39.5889L23.9611 28.4466Z" fill="#FEC53D" />
          </svg>
        </div>
        <div className="basis-1/4 flex bg-white px-6 py-3 rounded-xl">
          <div className="flex flex-col">
            <div className="text-left ">Total Order</div>
            <div className="text-left text-xl mt-1 font-semibold">{order.length}</div>
          </div>
          <div className="flex-grow"></div>
          <svg width="79" height="82" viewBox="0 0 89 82" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.21" fill-rule="evenodd" clip-rule="evenodd" d="M0 41.1181V59.0001C0 71.7026 10.2974 82.0001 23 82.0001H44.3397H65.6794C78.3819 82.0001 88.6794 71.7026 88.6794 59V41.1181V23.2361C88.6794 10.5335 78.382 0.236084 65.6794 0.236084H44.3397H23C10.2975 0.236084 0 10.5336 0 23.2361V41.1181Z" fill="#4AD991" />
            <path d="M34.375 21C33.2147 21 32.1019 21.4109 31.2814 22.1423C30.4609 22.8737 30 23.8657 30 24.9V56.1C30 57.1343 30.4609 58.1263 31.2814 58.8577C32.1019 59.5891 33.2147 60 34.375 60H60.625C61.7853 60 62.8981 59.5891 63.7186 58.8577C64.5391 58.1263 65 57.1343 65 56.1V32.7L51.875 21H34.375ZM34.375 24.9H49.6875V34.65H60.625V56.1H34.375V24.9ZM38.75 40.5V44.4H56.25V40.5H38.75ZM38.75 48.3V52.2H49.6875V48.3H38.75Z" fill="#4AD991" />
          </svg>
        </div>
        <div className="basis-1/4 flex bg-white px-6 py-3 rounded-xl">
          <div className="flex flex-col">
            <div className="text-left ">Total Brand</div>
            <div className="text-left text-xl mt-1 font-semibold">{brand.length}</div>
          </div>
          <div className="flex-grow"></div>
          <svg width="79" height="82" viewBox="0 0 89 82" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.21" fill-rule="evenodd" clip-rule="evenodd" d="M0 40.882V58.764C0 71.4665 10.2974 81.764 23 81.764H44.3397H65.6794C78.3819 81.764 88.6794 71.4665 88.6794 58.764V40.882V23C88.6794 10.2975 78.382 0 65.6794 0H44.3397H23C10.2975 0 0 10.2975 0 23V40.882Z" fill="#D94A5B" />
            <path d="M35.4282 38.1422C34.298 38.1422 33.1933 37.8071 32.2536 37.1793C31.3139 36.5514 30.5816 35.659 30.1491 34.6149C29.7166 33.5708 29.6034 32.4218 29.8239 31.3134C30.0444 30.205 30.5886 29.1869 31.3877 28.3877C32.1869 27.5886 33.205 27.0444 34.3134 26.8239C35.4218 26.6034 36.5708 26.7166 37.6149 27.1491C38.659 27.5816 39.5514 28.3139 40.1793 29.2536C40.8071 30.1933 41.1422 31.298 41.1422 32.4282C41.1404 33.9431 40.5377 35.3954 39.4665 36.4665C38.3954 37.5377 36.9431 38.1404 35.4282 38.1422ZM35.4282 29.5711C34.8632 29.5706 34.3108 29.7375 33.8407 30.0509C33.3706 30.3642 33.004 30.8099 32.7871 31.3315C32.5703 31.8532 32.513 32.4275 32.6224 32.9817C32.7319 33.536 33.0032 34.0453 33.4021 34.4454C33.801 34.8455 34.3095 35.1183 34.8634 35.2294C35.4173 35.3405 35.9917 35.2849 36.514 35.0696C37.0364 34.8544 37.4831 34.4891 37.7979 34.0199C38.1126 33.5508 38.2812 32.9988 38.2824 32.4339C38.2831 31.6759 37.9829 30.9486 37.4477 30.4118C36.9126 29.875 36.1862 29.5727 35.4282 29.5711Z" fill="#C31333" />
            <path d="M44.9192 60.1628L24.8371 40.0764C24.3016 39.5411 24.0005 38.8151 24 38.0579V23.857C24 23.0993 24.301 22.3726 24.8368 21.8368C25.3726 21.301 26.0993 21 26.857 21H41.0579C41.8156 21.0002 42.5422 21.3013 43.0778 21.8371L63.1628 41.9192C63.6984 42.455 63.9993 43.1815 63.9993 43.9391C63.9993 44.6967 63.6984 45.4233 63.1628 45.959L48.959 60.1628C48.6937 60.4282 48.3787 60.6388 48.032 60.7824C47.6853 60.9261 47.3137 61 46.9384 61C46.5631 61 46.1915 60.9261 45.8448 60.7824C45.4981 60.6388 45.1845 60.4282 44.9192 60.1628ZM26.857 23.857V38.0593L46.9391 58.1414L61.1414 43.9391L41.0593 23.857H26.857Z" fill="#C31333" />
          </svg>
        </div>
      </div>
      <div className="flex flex-row gap-6 mt-6">
        <div className="basis-2/3 bg-white rounded-xl px-6 py-3">
          <div className="text-lg font-bold text-left">Overview</div>
          {isLoading ? <div className="h-full flex justify-center items-center"><Spin /></div> :
            chartData.labels && chartData.labels.length > 0 ? (
              <Bar
                ref={chartRef}
                data={chartData}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Orders Per Month",
                      font: { weight: 'bold', size: 16 }
                    },
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Month'
                      }
                    }
                  },
                  borderRadius: 20
                }}
              />
            ) : (
              <p>No data</p>

            )
          }

        </div>
        <div className="basis-1/3 bg-white rounded-xl px-6 py-3">
          <div className="text-lg font-bold text-left">Best seller</div>
          {
            doughnutData.labels && doughnutData.labels.length > 0 ? (
              <Doughnut
                ref={chartRef2}
                data={doughnutData}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Sold Products by Type",
                      font: { weight: 'bold', size: 16 }
                    },
                    legend: {
                      position: 'right'
                    }
                  }
                }}
              />
            ) : (
              <p>Loading...</p>
            )
          }
        </div>
      </div>
    </div>
  </div>;
};

export default Dashboard;
