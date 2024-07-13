import { useActionData, useLoaderData } from "react-router-dom";

export const UserLoader = async () => {
  const STATUS_OPTION = [
    {
      value: "true",
      label: "Active",
    },
    {
      value: "false",
      label: "Inactive",
    },
  ];
  
  const ROLE_OPTION = [

    {
      value: "manager",
      label: "MANAGER",
    },
    {
      value: "staff",
      label: "STAFF",
    },
  ];
  return STATUS_OPTION, ROLE_OPTION;
};

export const UserAction = async () => {
  return null;
};

export const useUser = () => {
  const dataLoader = useLoaderData();
  const dataAction = useActionData();

  return dataAction || dataLoader;
};
