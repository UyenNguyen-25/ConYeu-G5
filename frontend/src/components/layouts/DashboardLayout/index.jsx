import { Outlet } from "react-router-dom";
import Navbar from "./Header";
import Sidebar from "./Sidebar";
import { Layout } from "antd";
const { Content } = Layout;

function DashboardLayout() {
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <Layout>
        {/* Header */}
        <Navbar />
        {/* Breadcrumbs */}
        <Content className="px-6">
          {/* <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            {crumbs}
          </Breadcrumb> */}
          {/* Dynamic Route Content */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default DashboardLayout;
