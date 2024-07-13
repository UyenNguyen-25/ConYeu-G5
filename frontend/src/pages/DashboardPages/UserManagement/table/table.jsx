import { useSelector } from "react-redux";
import CustomTable from "./CustomTable";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

const TableComponent = ({ usersList, isLoading, employeeBtn, refetch }) => {
  const listFormat = usersList?.map((user, index) => ({
    ...user,
    user_role: user.user_role.role_description,
    user_status: user.user_status === true ? "true" : "false",
    key: index + 1
  }));

  const user = useSelector(selectCurrentUser)

  const role = user?.user_role.role_description
  // console.log(role);

  return (
    <>
      <CustomTable
        list={listFormat}
        Loading={isLoading}
        employeeBtn={employeeBtn}
        role={role}
        refetch={refetch}
        currentUser={user.user_phoneNumber}
      />
    </>
  );
};

export default TableComponent;
