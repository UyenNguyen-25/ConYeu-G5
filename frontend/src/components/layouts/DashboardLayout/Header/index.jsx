import { Layout, Typography, theme, Flex } from "antd";
import DropdownCustomize from "../../../common/components/dropdown";
import { useSelector } from "react-redux";
import { ArrowRightLeft, LogOut, User } from "lucide-react";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
const { Header } = Layout;

function Navbar() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const userDetail = useSelector(selectCurrentUser);
  const itemsProps = [
    {
      label: "Hồ sơ",
      key: "/profile",
      icon: <User />,
      permission: ["customer", "staff", "manager"]
    },
    {
      label: "ConYeu",
      key: "/",
      icon: <ArrowRightLeft />,
    },
    {
      label: "Đăng xuất",
      key: "/login",
      icon: <LogOut />,
    },
  ];

  return (
    <Header
      style={{
        padding: 0,
        marginBottom: 25,
        background: colorBgContainer,
      }}
    >
      <Flex
        className="w-full h-full px-6"
        justify="space-between"
        align="center"
      >
        <Typography.Title
          level={3}
          style={{ color: "#007AFB", marginBottom: 0, fontWeight: "bold" }}
        >
          ConYeu Store - {userDetail?.user_role?.role_description.toUpperCase()}
        </Typography.Title>
        <DropdownCustomize
          itemsProps={itemsProps}
          className="bg-[#cfdcfd] text-[#007AFB]"
        />
      </Flex>
    </Header>
  );
}

export default Navbar;
