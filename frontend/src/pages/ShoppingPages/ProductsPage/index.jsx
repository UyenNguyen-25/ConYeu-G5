import { useEffect, useState } from "react";
import Filter from "./components/filter";
import ProductList from "./components/ProductList";
import Pagination from "./components/Pagination";
import usePagination from "./util/usePagination";
import { BASE_URL } from "@/constants/apiConfig";
import axios from "axios";
import { Skeleton } from "antd";

export default function ProductsPage() {
  const [product, setProduct] = useState([]);
  const [sort, setSort] = useState();
  const [filters, setFilters] = useState({
    brand: [],
    age: [],
  });
  const [displayedProducts, setDisplayedProducts] = useState([]);

  const { paginatedItems, hasNextPage, hasPrevPage } =
    usePagination(displayedProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/product/get-all-product`
        );
        console.log("response", response.data);
        if (!response) {
          throw new Error("Network response was not ok");
        }
        const productsData = await response.data;
        console.log("responseeeeee", productsData);
        setProduct(productsData);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchProducts();
  }, []);
  console.log("product index", product);

  const handleFilterChange = (filterType, value) => {
    console.log("first");
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter((item) => item !== value)
        : [...prevFilters[filterType], value],
    }));
  };

  useEffect(() => {
    // console.log('filter thay đổi', filters)
    const filteredProducts = product.filter((item) => {
      if (
        filters.brand.length > 0 &&
        !filters.brand.includes(item.product_brand_id.brand_name)
      ) {
        return false;
      }

      if (filters.age.length > 0 && !filters.age.includes(item.product_age)) {
        return false;
      }
      return true;
    });

    if (sort) {
      filteredProducts.sort((a, b) => {
        if (sort === "lowToHigh") {
          return a.product_price - b.product_price;
        } else if (sort === "highToLow") {
          return b.product_price - a.product_price;
        }
        return 0;
      });
    }
    // console.log('filteredProducts', filteredProducts)
    setDisplayedProducts(filteredProducts);
  }, [filters, product, sort]);

  const handleSort = (option) => {
    setSort(option);
  };

  return (
    <div className="flex gap-x-3 px-12 py-1 mt-10 mb-10">
      <div className="w-1/6">
        <Filter onFilterChange={handleFilterChange} />
      </div>
      <div className="w-full flex flex-col gap-y-3">
        <div className="bg-white h-16 rounded-lg py-4">
          <div className="flex gap-5 ml-4">
            <button
              className={`border border-[#D1D4D5] rounded-lg px-3 py-1 ${
                !sort ? "bg-[#007AFB] text-white" : ""
              }`}
              onClick={() => handleSort()}
            >
              Tất cả
            </button>
            <button
              className={`border border-[#D1D4D5] rounded-lg px-3 py-1 ${
                sort === "lowToHigh" ? "bg-[#007AFB] text-white" : ""
              }`}
              onClick={() => handleSort("lowToHigh")}
            >
              Giá Thấp - Cao
            </button>
            <button
              className={`border border-[#D1D4D5] rounded-lg px-3 py-1 ${
                sort === "highToLow" ? "bg-[#007AFB] text-white" : ""
              }`}
              onClick={() => handleSort("highToLow")}
            >
              Giá Cao - Thấp
            </button>
          </div>
        </div>
        {product.length > 0 ? (
          <>
            <ProductList product={paginatedItems} />
            <Pagination
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              product={displayedProducts.length}
            />
          </>
        ) : (
          <Skeleton />
        )}
      </div>
    </div>
  );
}
