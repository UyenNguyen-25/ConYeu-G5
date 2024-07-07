import { useGetUsersQuery } from "@/redux/features/users/usersApiSlice";
import { useUser } from "@/routes/userRoute";
import { useEffect, useState } from "react";
import { Button, Input } from "antd";
import CreateAccount from "./CreateAccount";
import TableComponent from "./table/table";

const { Search } = Input;

const UserManagement = () => {
  // eslint-disable-next-line no-unused-vars
  const resultData = useUser();
  const [userList, setUserList] = useState([]);
  const [params, setParams] = useState({
    search: resultData.search,
    role: resultData.role,
  });
  const [isActive, setIsActive] = useState({ bt1: true, bt2: false });

  const { data: users, refetch, isLoading } = useGetUsersQuery(params, {
    refetchOnMountOrArgChange: true,
  });

  const onSearch = (value) => {
    setParams((params) => ({ ...params, search: value }));
  };

  useEffect(() => {
    setUserList(users);
    console.log(users);
  }, [users]);

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between w-full">
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            enterButton
            className="w-1/3"
          />
          <CreateAccount refetch={refetch} />
        </div>
        <div className="flex-1 space-x-6">
          <Button
            onClick={() => {
              setIsActive({ bt1: true, bt2: false });
              setParams((params) => ({ ...params, role: "employee" }));
            }}
            type={`${isActive.bt1 ? "primary" : ""}`}
          >
            Employee
          </Button>
          <Button
            onClick={() => {
              setIsActive({ bt1: false, bt2: true });
              refetch()
              setParams((params) => ({ ...params, role: "customer" }));
            }}
            type={`${isActive.bt2 ? "primary" : ""}`}
          >
            Customer
          </Button>
        </div>
        <div>
          <TableComponent
            usersList={userList}
            isLoading={isLoading}
            employeeBtn={isActive.bt1}
            refetch={refetch}
          />
        </div>
      </div>
    </>
  );
};

export default UserManagement;
