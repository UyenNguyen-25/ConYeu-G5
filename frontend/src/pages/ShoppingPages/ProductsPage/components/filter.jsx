/* eslint-disable no-unused-vars */
import { BASE_URL } from "@/constants/apiConfig";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Filter = ({ onFilterChange }) => {
  const [product, setProduct] = useState([]);
  const [ages, setAges] = useState([]);
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    const fetchFilter = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/product/get-all-product`);
        console.log('response', response.data)
        // if (!response.ok) {
        //   throw new Error("Network response was not ok");
        // }
        const productsData = await response.data;
        // setProduct(productsData);

        const uniqueAges = [...new Set(productsData.map(product => product.product_age))];
        console.log('uniqueAges', uniqueAges)
        setAges(uniqueAges);
        const uniqueBrands = [...new Set(productsData.map(product => product.product_brand_id.brand_name))];
        console.log('uniqueBrands', uniqueBrands)
        setBrands(uniqueBrands);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchFilter();
  }, []);
  const age = [
    { range: "0-1", name: "0-1 year" },
    { range: "1-2", name: "1-2 years" },
    { range: "2-3", name: "2-3 years" },
    { range: "suabau", name: "Sữa bầu" },
  ];

  const brand = [
    { name: "Ensure" },
    { name: "PediaSure" },
    { name: "Abbott Grow" },
    { name: "Vinamilk" },
    { name: "Friso Gold" },
    { name: "Enfa" },
    { name: "Similac" },
    { name: "Nutifood" },
  ];
  const handleChangeBrand = (e, index) => {
    onFilterChange("brand", e.target.value);
  };

  const handleChangeAge = (e, index) => {
    onFilterChange("age", e.target.value);
  };

  return (
    <div className="bg-white flex flex-col justify-center px-8 gap-y-4 rounded-lg text-base pb-6 mr-4">
      <div className="flex flex-col gap-y-3">
        <h1 className="my-6 font-bold">Độ tuổi</h1>
        {ages.map((age, i) => {
          return (
            <div key={i}>
              <input
                id={i}
                type="checkbox"
                value={age}
                onChange={(e) => {
                  handleChangeAge(e, i);
                }}
              />
              <label className="ml-2">{age}</label>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-y-3">
        <h1 className="my-6 font-bold">Thương hiệu</h1>
        {brands.map((brand, i) => {
          return (
            <div key={i}>
              <input
                id={i}
                type="checkbox"
                value={brand}
                onChange={(e) => {
                  handleChangeBrand(e, i);
                }}
              />
              <label className="ml-2">{brand}</label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Filter;
