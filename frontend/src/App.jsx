/* eslint-disable react/jsx-key */
// import React from "react";
import { Suspense, useEffect } from "react";
import { Toaster } from "sonner";
import { RecaptchaVerifier } from "firebase/auth";
import auth from "./auth/firebase/setup";
import { Outlet } from "react-router-dom";
import { Skeleton } from "antd";
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
        size: "invisible",
      });
    }
    // console.log(window.recaptchaVerifier);
  }, []);

  return (
    <Provider store={store}>
      <Toaster
        theme="light"
        position="top-right"
        richColors
        toastOptions={{ duration: 1000 }}
      />
      <div id="recaptcha"></div>
      <Suspense fallback={<Skeleton />}>
        <Outlet />
      </Suspense>
    </Provider>
  );
}

export default App;
