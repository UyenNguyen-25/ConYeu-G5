import { useGetUsersQuery } from "@/redux/features/users/usersApiSlice";
import { useEffect, useState } from "react";
import { Button, Input } from "antd";
import CreateAccount from "./CreateAccount";
import TableComponent from "./table/table";

const { Search } = Input;

const UserManagement = () => {
  const [userList, setUserList] = useState([]);
  const [params, setParams] = useState({
    search: "",
    role: "employee",
  });
  const [isActive, setIsActive] = useState(true);

  const { data: users, refetch, isLoading } = useGetUsersQuery(params, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true
  });

  const onSearch = (value) => {
    setParams((params) => ({ ...params, search: value }));
  };

  useEffect(() => {
    setUserList(users);
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
        <div className="flex-1 space-x-5">
          <Button
            onClick={() => {
              setIsActive(true);
              refetch()
              setParams((params) => ({ ...params, role: "employee" }));
            }}
            type={`${isActive ? "primary" : ""}`}
          >
            Employee
          </Button>
          <Button
            onClick={() => {
              setIsActive(false);
              refetch()
              setParams((params) => ({ ...params, role: "customer" }));
            }}
            type={`${isActive ? "" : "primary"}`}
          >
            Customer
          </Button>
        </div>
        <div>
          <TableComponent
            usersList={userList}
            isLoading={isLoading}
            employeeBtn={isActive}
            refetch={refetch}
          />
        </div>
      </div>
    </>
  );
};

export default UserManagement;
