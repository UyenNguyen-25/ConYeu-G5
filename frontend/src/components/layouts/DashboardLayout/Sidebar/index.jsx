import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { ConfigProvider, Menu, Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import { FileText, Hexagon, Home, Package, Users } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const user = useSelector(selectCurrentUser);
  const user_role = user?.user_role.role_description;

  const getItem = (label, key, icon, permission) => {
    return (
      permission.includes(user_role) && {
        key,
        icon,
        label,
        permission,
      }
    );
  };

  const items = [
    getItem("Home", "/dashboard", <Home size={20} />, [
      "admin",
      "manager",
      "staff",
    ]),
    getItem(
      "Products Management",
      "products-management",
      <Package size={20} />,
      ["admin", "manager", "staff"]
    ),
    getItem("Orders Management", "/dashboard/orders-management", <FileText size={20} />, [
      "admin",
      "manager",
      "staff",
    ]),
    getItem("Users Management", "/dashboard/users-management", <Users size={20} />, [
      "admin",
      "manager",
      "staff",
    ]),
    getItem("Brand Management", "/dashboard/brands-management", <Hexagon size={20} />, [
      "admin",
      "manager",
      "staff",
    ]),
  ];

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          controlItemBgActive: "#FFFFFF",
          colorText: "#FFFFFF",
        },
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        collapsedWidth={80}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
        style={{
          background: "#61ADFD",
        }}
      >
        {collapsed === false && (
          <Typography.Title style={{ textAlign: "center", marginTop: 10 }}>
            MENU
          </Typography.Title>
        )}
        <Menu
          defaultSelectedKeys={location.pathname}
          mode="inline"
          items={items}
          onClick={(e) => handleNavigate(e.key)}
          style={{
            background: "#61ADFD",
          }}
        />
      </Sider>
    </ConfigProvider>
  );
};

export default Sidebar;
