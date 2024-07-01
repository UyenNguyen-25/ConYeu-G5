import { useSendLogoutMutation } from "@/redux/features/auth/authApiSlice";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { Avatar, Button, Dropdown, Flex } from "antd";
import { ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DropdownCustomize = (props) => {
  // eslint-disable-next-line no-unused-vars
  const { itemsProps, className } = props;
  const userDetail = useSelector(selectCurrentUser);
  const splitName = userDetail?.user_fullname.split(" ");
  const user_role = userDetail?.user_role?.role_description;
  const navigate = useNavigate();
  const [sendLogout] = useSendLogoutMutation();

  const checkRoleGate = (item) => {
    return item?.permission.includes(user_role?.toLowerCase()) && item;
  };

  const checkRoleGateItem = itemsProps
    .map((item) => (item?.permission ? checkRoleGate(item) : item))
    .filter((item) => item !== false);

  const handleMenuClick = async (e) => {
    if (e.key === "/login") {
      await sendLogout();
      toast.success("Đăng xuất thành công");
      navigate("login");
    } else navigate(e.key);
  };

  const menuProps = {
    items: checkRoleGateItem,
    onClick: handleMenuClick,
  };

  return userDetail ? (
    <Dropdown menu={menuProps} placement="bottomRight" trigger={"click"}>
      <Button className="border-none h-fit shadow-none">
        <Flex gap={6} align="center">
          <Avatar className={className}>
            {userDetail?.user_fullname === "Ba, mẹ"
              ? "A"
              : splitName.slice(-1)[0].charAt(0)}
          </Avatar>
          {userDetail?.user_fullname}
          <ChevronDown />
        </Flex>
      </Button>
    </Dropdown>
  ) : (
    <div>
      {" "}
      <Button type="link" onClick={() => navigate("/register")}>
        Đăng ký
      </Button>
      /
      <Button type="link" onClick={() => navigate("/login")}>
        Đăng nhập
      </Button>
    </div>
  );
};

export default DropdownCustomize;
