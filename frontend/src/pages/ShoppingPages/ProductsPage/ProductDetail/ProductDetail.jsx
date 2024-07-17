import { Skeleton } from "@/components/ui/skeleton";
import { BASE_URL } from "@/constants/apiConfig";
import { addToCart } from "@/redux/features/cart/cartSlice";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Alert } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ProductReviews from "../components/ProductReviews";
import { soldout } from "@/assets/logo";

const ProductDetail = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState();
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [alert, setAlert] = useState(false);
  const nav = useNavigate();
  const dispatch = useDispatch();
  const formatter = new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "VND",
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/api/product/get-product-by-id/${id}`
        );

        setLoading(false);
        const productDetail = await response.data;
        console.log("jjjjjjjjjjj", productDetail);
        setDetail(productDetail.product);
      } catch (error) {
        console.error("Fail to fetch", error);
      }
    };
    fetchDetail();
  }, [id]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity, stock: product.quantity }));
    toast.success("Thêm vào giỏ hàng thành công!", {
      position: "top-right",
    });
  };

  const handleBuyNow = (product) => {
    dispatch(addToCart({ ...product, quantity }));
    nav("/cart");
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
    console.log("handleDecrease");
  };

  const handleIncrease = () => {
    if (quantity < detail.quantity) {
      setQuantity(quantity + 1);
    }
  };
  console.log("llllllllllllll", quantity);

  return (
    <div className=" px-24 py-6">
      <div className=" bg-white shadow-2xl px-12 py-6 rounded-lg">
        {loading ? (
          <div>
            <div className="flex">
              <Skeleton className="w-[641px] h-[641px] bg-[#F5F5F6]" />
              <div className="ml-36 flex flex-col gap-y-10">
                <Skeleton className="h-8 bg-[#F5F5F6]" />
                <Skeleton className="bg-[#F5F5F6] h-7" />
                <Skeleton className="bg-[#F5F5F6] py-4 pl-7 h-14" />
                <div className="flex gap-x-10">
                  <Skeleton className="text-xl font-bold bg-[#F5F5F6] h-12 w-36" />
                  <div className="flex gap-x-0">
                    <Skeleton className="bg-[#F5F5F6] h-12 w-12" />
                    <Skeleton className="bg-[#F5F5F6] h-12 w-12" />
                    <Skeleton className="bg-[#F5F5F6] h-12 w-12" />
                  </div>
                </div>
                <div className="flex gap-x-6">
                  <Skeleton className="rounded-2xl bg-[#F5F5F6] h-[52px] w-[193px]" />
                  <Skeleton className="rounded-2xl bg-[#F5F5F6] h-[52px] w-[160px]" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-y-5">
              <Skeleton className="bg-[#F5F5F6] py-4 pl-7 text-2xl font-bold mt-5 h-12 w-full" />
              <Skeleton className="text-xl bg-[#F5F5F6] h-36 w-full" />
              <Skeleton className="w-[641px] h-[641px] bg-[#F5F5F6]" />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex">
              <img
                className="w-2/5 border border-gray-300 rounded-lg"
                src={detail?.product_img}
              />
              <div className="ml-36 flex flex-col gap-y-10">
                <p className="text-3xl font-extrabold">
                  Brand: {detail?.product_brand_id?.brand_name}
                </p>
                <p className="text-xl">{detail?.product_name}</p>
                <div className="bg-[#E7F3FF] py-4 pl-7 text-2xl font-bold">
                  {formatter.format(detail?.product_price)}
                </div>
                {/* <div className="text-xl">
                  Kho: {detail.quantity > 0 ? detail.quantity : <img className="w-1/2" src={soldout}/>}
                </div> */}
                {
                  detail.quantity > 0 ? (
                    <div className="text-xl">
                  Kho: {detail.quantity}
                </div>
                  ) : (
                    <img className="w-1/2" src={soldout}/>
                  )
                }
                <div className="flex gap-x-10">
                  <p className="text-xl font-bold">Chọn số lượng</p>
                  <div className="flex gap-x-0">
                    <button
                      className="bg-[#E5E9EB] w-10 py-2 rounded-l-full font-bold"
                      onClick={handleDecrease}
                    >
                      <MinusOutlined />
                    </button>
                    <p className="bg-[#E5E9EB] text-center py-2 w-10 text-xl">
                      {quantity}
                    </p>
                    <button
                      className="bg-[#E5E9EB] w-10 py-2 rounded-r-full font-bold"
                      onClick={handleIncrease}
                    >
                      <PlusOutlined />
                    </button>
                  </div>
                </div>
                <div className="flex gap-x-6">
                  <button
                    className="bg-[#007AFB] px-9 py-3 text-xl text-white rounded-2xl hover:bg-blue-400"
                    onClick={() => handleAddToCart(detail)} 
                    disabled={detail.quantity === 0}
                  >
                    Thêm vào giỏ
                  </button>
                  <button
                    className="bg-[#5B5E62] px-9 py-3 text-xl text-white rounded-2xl hover:bg-gray-500"
                    onClick={() => handleBuyNow(detail)}
                    disabled={detail.quantity === 0}
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-y-5">
              <div className="bg-[#E7F3FF] py-4 pl-7 text-2xl font-bold mt-5">
                MÔ TẢ SẢN PHẨM
              </div>
              <div className="text-xl">{detail?.product_description}</div>
              <img
                className="w-2/5 border border-gray-300 rounded-lg mx-auto"
                src={detail?.product_img}
              />
            </div>
            <ProductReviews product={detail} />
          </div>
        )}
      </div>
      {/* <Toaster /> */}
    </div>
  );
};

export default ProductDetail;