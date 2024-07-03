/* eslint-disable react-hooks/exhaustive-deps */
import Logo from "@/assets/logo";
import Footer from "@/components/layouts/DefaultLayout/Footer";
// import { routes } from "@/routes";
import { Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import { ArrowLeft } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

const AnonymousLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-stretch">
      {/* Header */}
      <Header className="bg-white text-4xl text-[#545454] ">
        <div className="w-full h-full flex items-center justify-between font-mono font-semibold">
          <div className="flex items-center gap-6">
            {Logo()}
            {/* {subRouter?.title && (
              <>
                <div>|</div> {subRouter.title}
              </>
            )} */}
          </div>
          <Typography.Link
            className="flex items-center gap-2 text-lg"
            onClick={() => navigate("/")}
          >
            <ArrowLeft strokeWidth={2.25} size={20} /> Trang chủ
          </Typography.Link>
        </div>
      </Header>
      {/* Main Content */}
      <div className="flex flex-1 justify-center items-center overflow-y-auto bg-login-bg bg-cover rounded-md">
        {/* Dynamic Route Content */}
        <main className="bg-white min-w-[400px] max-w-[450px] p-6 pb-2 my-10 rounded-lg">
          <Outlet />
        </main>
      </div>
      {/* </div> */}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AnonymousLayout;
