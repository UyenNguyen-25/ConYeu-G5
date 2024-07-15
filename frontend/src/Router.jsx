import { createBrowserRouter } from "react-router-dom";
import App from "./App";
// import { lazy } from "react";
import HomePage from "./pages/ShoppingPages/HomePage";
import DefaultLayout from "./components/layouts/DefaultLayout";
import AnonymousLayout from "./auth/AnonymousLayout";
import Login from "./auth/Login/LoginPage";
import Register from "./auth/Register/RegisterPage";
import ForgotPassword from "./auth/ForgotPassword/ForgotPassword";
import DashboardLayout from "./components/layouts/DashboardLayout";
import ProductDetail from "./pages/ShoppingPages/ProductsPage/ProductDetail/ProductDetail";
import OrderPage from "./pages/ShoppingPages/OrderPage";
import RequestReturn from "./pages/ShoppingPages/OrderPage/OrderTracking/RequestReturn";
import ReasonReturn from "./pages/ShoppingPages/OrderPage/OrderTracking/ReasonReturn";
import ContactPage from "./pages/ShoppingPages/ContactPage";
import CartPage from "./pages/ShoppingPages/CartPage/CartPage";
import ProductManagement from "./pages/DashboardPages/ProductManagement";
import OrderManagement from "./pages/DashboardPages/OrderManagement";
import UserManagement from "./pages/DashboardPages/UserManagement";
import ErrorBoundary from "./components/common/Error";
import ProductsPage from "./pages/ShoppingPages/ProductsPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import SetNewPassword from "./auth/ForgotPassword/SetNewPassword";
import Profile from "./pages/ProfillePages";
import ResetToken from "./routes/ResetRoute/index.";
import CheckPermissionRoute from "./routes/CheckPermission";
import OrderConfirmationPage from "./pages/ShoppingPages/OrderPage/OrderConfirmation";
import OrderDetailUser from "./pages/ShoppingPages/OrderPage/OrderDetail/OrderDetail";
import Dashboard from "./pages/DashboardPages/Dashboard";
import Prefetch from "./routes/Prefetch";
import BrandManagement from "./pages/DashboardPages/BrandManagement";
// import { UserLoader } from "./routes/userRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: (
          <ProtectedRoute>
            <DefaultLayout />
          </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "products",
            element: <ProductsPage />,
            children: [],
          },
          {
            path: "products/:id",
            element: <ProductDetail />,
          },
          {
            path: "purchase",
            element: <OrderPage />,
          },
          // { path: "purchase/order-detail", element: <OrderDetail /> },
          { path: "order/order-detail/:orderId", element: <OrderDetailUser /> },
          {
            path: "purchase/request-return",
            element: <RequestReturn />,
          },
          {
            path: "purchase/request-return/reason",
            element: <ReasonReturn />,
          },
          {
            path: "cart",
            element: <CartPage />,
            children: [{ path: "", element: "" }],
          },
          {
            path: "contact",
            element: <ContactPage />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "order-confirmation",
            element: <OrderConfirmationPage />,
          },

        ],
      },
      {
        element: (
          <ResetToken>
            <AnonymousLayout />
          </ResetToken>
        ),
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "forgot-password",
            element: <ForgotPassword />,
          },
          {
            path: "set-new-password",
            element: <SetNewPassword />,
          },
        ],
      },
      {
        element: (
          <ProtectedRoute>
            <CheckPermissionRoute>
              <Prefetch>
                <DashboardLayout />
              </Prefetch>
            </CheckPermissionRoute>
          </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />,
        path: "dashboard",
        children: [
          {
            path: "",
            element: <Dashboard />,
            children: [],
          },
          {
            path: "products-management",
            element: <ProductManagement />,
            children: [],
          },
          {
            path: "orders-management",
            element: <OrderManagement />,
            children: [],
          },
          {
            path: "brands-management",
            element: <BrandManagement />,
            children: [],
          },
          {
            path: "users-management",
            // loader: <UserLoader />,
            shouldRevalidate: ({ currentUrl, nextUrl }) =>
              currentUrl.pathname !== nextUrl.pathname,
            element: <UserManagement />,
            children: [],
          },
        ],
      },
    ],
  },
]);

export default router;
