import { useActionData, useLoaderData } from "react-router-dom";

export const UserLoader = async () => {
  const search = "";
  const role = "employee";
  return { search, role };
};

export const UserAction = async () => {
  return null;
};

export const useUser = () => {
  const dataLoader = useLoaderData();
  const dataAction = useActionData();

  return dataAction || dataLoader;
};
