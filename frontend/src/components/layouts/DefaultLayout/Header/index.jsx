import {
  ArrowRightLeft,
  LogOut,
  ReceiptText,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import SearchInput from "./search-input";
import { Badge, Button } from "antd";
import DropdownCustomize from "../../../common/components/dropdown";
import Logo from "@/assets/logo";
import { useSelector } from "react-redux";

function Header() {
  const routes = [
    { title: "Trang chủ", path: "/" },
    { title: "Sản Phẩm", path: "/products" },
    { title: "Liên hệ", path: "/contact" },
  ];

  // eslint-disable-next-line no-unused-vars
  const cart = useSelector((state) => state.cart);
  const pathShowSearch = ["/", "/products"];
  const currentPath = useLocation();
  const countCart = cart?.items?.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.quantity;
  }, 0);

  const itemsProps = [
    {
      label: "Hồ sơ",
      key: "/profile",
      icon: <User />,
      permission: ["customer", "staff", "manager"]
    },
    {
      label: "Dashboard",
      key: "dashboard",
      icon: <ArrowRightLeft />,
      permission: ["admin", "staff", "manager"],
    },
    {
      label: "Đơn mua",
      key: "purchase",
      icon: <ReceiptText />,
      permission: ["customer", "staff", "manager"]
    },
    {
      label: "Đăng xuất",
      key: "/login",
      icon: <LogOut />,
    },
  ];

  return (
    <div className="flex flex-col items-stretch z-50 shadow-xl">
      {/* NavBar */}
      <div className="flex items-center justify-between p-3 px-6 lg:pl-24 lg:pr-10 text-[#545454]">
        <Link to={"/"}>{Logo()}</Link>
        <div className="flex space-x-5 lg:space-x-16 ">
          {routes.map((route) => {
            return (
              <NavLink
                key={route.path}
                to={route.path}
                style={({ isActive }) => {
                  return {
                    fontWeight: isActive && "bold",
                    color: isActive && "#E44918",
                  };
                }}
                className="text-xl lg:text-[22px]"
              >
                {route.title}
              </NavLink>
            );
          })}
        </div>
        <div className="flex items-center gap-2 lg:gap-6 text-sm lg:text-[17px]">
          <Badge count={countCart}>
            <NavLink
              to={"/cart"}
              className=" flex items-center gap-2 relative hover:bg-[#f2f2f2] p-2 rounded-xl text-[#545454] hover:text-[#545454] lg:text-[17px]"
              style={({ isActive }) => {
                return {
                  fontWeight: isActive && "bold",
                  color: isActive && "#E44918",
                };
              }}
            >
              <ShoppingCart size={21} />
              <span className="lg:inline hidden">Giỏ hàng</span>
            </NavLink>
          </Badge>

          <DropdownCustomize
            itemsProps={itemsProps}
            className="bg-[#fde3cf] text-[#f56a00]"
          />
        </div>
      </div>

      {/* Search */}
      {pathShowSearch.some((path) => path === currentPath.pathname) && (
        <div className="p-3 bg-customer-home">
          <div className="w-fit lg:w-2/4 m-auto flex items-center justify-center bg-customer-action-blue rounded-xl">
            <SearchInput placeholder="Ba mẹ cần tìm gì?" />
            <Button ghost className="px-3 lg:px-8 min-w-xs border-none">
              <Search color="white" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
