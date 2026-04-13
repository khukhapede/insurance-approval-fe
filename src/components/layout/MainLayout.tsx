import { Layout, Breadcrumb } from "antd";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { claimsService } from "@/services";

const { Sider, Content } = Layout;
const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/claims": "My Claims",
  "/claims/submit": "Submit Claim",
  "/verifier/dashboard": "Dashboard",
  "/claims/submitted": "Submitted Claims",
  "/approver/dashboard": "Dashboard",
  "/claims/verified": "Verified Claims",
  "/staff/claims": "Claims",
};

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { themeMode } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const claimIdMatch = location.pathname.match(/^\/claims\/([0-9a-f-]{36})/);
  const claimId = claimIdMatch?.[1];

  const { data: claim } = useQuery({
    queryKey: ["claim", claimId],
    queryFn: () => claimsService.getClaimById(claimId!),
    enabled: !!claimId,
  });

  const pathSnippets = location.pathname.split("/").filter(Boolean);
  const breadcrumbItems = [
    { title: "Home", onClick: () => navigate("/") },
    ...pathSnippets.map((snippet, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      const isUUID = /^[0-9a-f-]{36}$/.test(snippet);
      const isEdit = snippet === "edit";

      let title = breadcrumbMap[url] ?? snippet;
      if (isUUID) title = claim?.claimNumber ?? "Claim Detail";
      if (isEdit) title = "Edit";

      return { title };
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
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={200}
          style={{
            background: themeMode === "dark" ? "#1f1f1f" : "#fff",
            borderRight: `1px solid ${themeMode === "dark" ? "#303030" : "#f0f0f0"}`,
          }}
        >
          <AppSidebar collapsed={collapsed} />
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
