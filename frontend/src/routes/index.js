import HomePage from "@/pages/ShoppingPages/HomePage";
import ProductPage from "@/pages/ShoppingPages/ProductsPage";
import ContactPage from "@/pages/ShoppingPages/ContactPage";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Login from "@/auth/Login/LoginPage";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import Dashboard from "@/pages/DashboardPages/Dashboard";
import AnonymousLayout from "@/auth/AnonymousLayout";
import { renderRoutes } from "./generate-routes";
import ErrorBoundary from "@/components/common/Error";
import ForgotPassword from "@/auth/ForgotPassword/ForgotPassword";
import Register from "@/auth/Register/RegisterPage";
import ProductsManagement from "@/pages/DashboardPages/ProductManagement";
import OrdersManagement from "@/pages/DashboardPages/OrderManagement";
import UsersManagement from "@/pages/DashboardPages/UserManagement";
import ProductDetail from "@/pages/ShoppingPages/ProductsPage/ProductDetail/ProductDetail";
import CartPage from "@/pages/ShoppingPages/CartPage/CartPage";
import OrderPage from "@/pages/ShoppingPages/OrderPage";
import OrderDetail from "@/pages/ShoppingPages/OrderPage/OrderDetail/OrderDetail";
import RequestReturn from "@/pages/ShoppingPages/OrderPage/OrderTracking/RequestReturn";
import ReasonReturn from "@/pages/ShoppingPages/OrderPage/OrderTracking/ReasonReturn";

export const routes = [
  {
    layout: DefaultLayout,
    path: "/",
    isPublic: true,
    routes: [
      {
        name: "Home",
        title: "Trang chủ",
        path: "/",
        component: HomePage,
      },
      {
        name: "Products",
        title: "Sản Phẩm",
        component: ProductPage,
        path: "products",
        routes: [
          {
            name: "Product Detail",
            title: "ProductDetail",
            path: "/products/:id",
            component: ProductDetail,
          },
        ],
      },
      {
        name: "Order",
        title: "Order",
        component: OrderPage,
        path: "/purchase",
        isPublic: true,
        routes: [
          {
            name: "OrderDetail",
            title: "OrderDetail",
            path: "/purchase/order-detail",
            component: OrderDetail,
          },
          {
            name: "RequestReturn",
            title: "RequestReturn",
            path: "/purchase/request-return",
            component: RequestReturn,
          },
          {
            name: "ReasonReturn",
            title: "ReasonReturn",
            path: "/purchase/request-return/reason",
            component: ReasonReturn,
          },
        ],
      },
      {
        name: "Contact",
        title: "Liên hệ",
        component: ContactPage,
        path: "contact",
      },
      {
        name: "ViewCart",
        title: "ViewCart",
        path: "cart",
        component: CartPage,
      },
      {
        name: "NotFound",
        title: "NotFound",
        path: "*",
        component: ErrorBoundary,
      },
    ],
  },
  {
    layout: AnonymousLayout,
    path: "",
    isPublic: true,
    routes: [
      {
        name: "Login",
        title: "Đăng Nhập",
        component: Login,
        path: "login",
      },
      {
        name: "Register",
        title: "Đăng Ký",
        component: Register,
        path: "register",
      },
      {
        name: "forgot-password",
        component: ForgotPassword,
        path: "forgot-password",
      },
    ],
  },
  {
    layout: DashboardLayout,
    path: "/",
    isPublic: false,
    routes: [
      {
        name: "Dashboard",
        title: "Dashboard",
        path: "dashboard",
        component: Dashboard,
        permission: ["admin", "manager", "staff"],
      },
      {
        name: "ProductsManagement",
        title: "Products Management",
        path: "products-management",
        component: ProductsManagement,
        permission: ["admin", "manager", "staff"],
      },
      {
        name: "OrdersManagement",
        title: "Orders Management",
        path: "orders-management",
        component: OrdersManagement,
        permission: ["admin", "manager", "staff"],
      },
      {
        name: "UsersManagement",
        title: "Users Management",
        path: "users-management",
        component: UsersManagement,
        permission: ["admin"],
      },
    ],
  },
];

export const Routes = renderRoutes(routes);
