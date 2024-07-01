/* eslint-disable react/jsx-key */
// import React from "react";
import { useEffect } from "react";
import { Routes } from "./routes";
import { Toaster } from "sonner";
import { RecaptchaVerifier } from "firebase/auth";
import auth from "./auth/firebase/setup";

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
    <>
      <Toaster
        theme="light"
        position="top-right"
        richColors
        toastOptions={{ duration: 1000 }}
      />
      <div id="recaptcha"></div>
      <Routes />
    </>
  );
}

export default App;
