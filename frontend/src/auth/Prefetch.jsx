import { productsApiSlice } from "@/redux/features/products/productsApiSlice";
import { usersApiSlice } from "@/redux/features/users/usersApiSlice";
import store from "@/redux/store";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
  useEffect(() => {
    try {
      console.log("subscribing");
      const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());
      const products = store.dispatch(
        productsApiSlice.endpoints.getProducts.initiate()
      );
      return () => {
        console.log("unsubscribing");
        users.unsubscribe();
        products.unsubscribe();
      };
    } catch (error) {
      console.log(error);
    }
  }, []);

  return <Outlet />;
};

export default Prefetch;
