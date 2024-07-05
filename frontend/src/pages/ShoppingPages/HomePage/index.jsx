// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { homePage } from "@/assets/logo";
export default function HomePage() {
  const nav = useNavigate();
  return (
    <div className="relative w-full">
      <img
        className="object-cover"
        src={homePage}
        alt="Landing Page"
      />
      <div className="overlay absolute inset-0 flex flex-col items-start justify-center pl-[200px] -top-36 text-black">
        <h1 className="text-6xl font-bold font-shadows-into-light-regular drop-shadow-lg">
          Welcome to Conyeu!
        </h1>
        <p className="text-2xl poppins-light-italic mt-5 drop-shadow-md">
          Nuôi dưỡng tương lai từ hôm nay.
        </p>
        <div className="mt-5 space-y-2">
          <p className="text-xl flex items-center">
            <span className="mr-2">🥛</span> Sữa ngon
          </p>
          <p className="text-xl flex items-center">
            <span className="mr-2">🌱</span> Sữa sạch
          </p>
          <p className="text-xl flex items-center">
            <span className="mr-2">💪</span> Sữa khỏe
          </p>
        </div>
        <button
          className="text-2xl border border-transparent bg-[#E44918] hover:bg-[#d63e12] rounded-full text-white px-6 py-3 mt-10 transition duration-300 transform hover:scale-105 shadow-lg"
          onClick={() => nav("/products?page=1&per_page=8")}
        >
          Bắt đầu mua sắm
        </button>
      </div>
    </div>
  );
}
