import { Layout, Breadcrumb } from "antd";
import { useTheme } from "@/contexts/ThemeContext";

import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

const { Sider, Content } = Layout;
const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/claims": "My Claims",
  "/claims/submit": "Submit Claim",
  "/verifier/dashboard": "Dashboard",
  "/claims/submitted": "Submitted Claims",
  "/approver/dashboard": "Dashboard",
  "/claims/verified": "Verified Claims",
};

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { themeMode } = useTheme();

  const pathSnippets = location.pathname.split("/").filter(Boolean);
  const breadcrumbItems = [
    { title: "Home", onClick: () => navigate("/") },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      return {
        title: breadcrumbMap[url] ?? url,
      };
    }),
  ];

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: themeMode === "dark" ? "#141414" : "#f5f5f5",
      }}
    >
      <AppHeader />
      <Layout
        style={{ background: themeMode === "dark" ? "#141414" : "#f5f5f5" }}
      >
        <Sider
          width={200}
          style={{
            background: themeMode === "dark" ? "#1f1f1f" : "#fff",
            borderRight: `1px solid ${themeMode === "dark" ? "#303030" : "#f0f0f0"}`,
          }}
        >
          <AppSidebar />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
            background: themeMode === "dark" ? "#141414" : "#f5f5f5",
          }}
        >
          <Breadcrumb items={breadcrumbItems} style={{ margin: "16px 0" }} />
          <Content
            style={{
              padding: 24,
              background: themeMode === "dark" ? "#1f1f1f" : "#fff",
              borderRadius: 8,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
