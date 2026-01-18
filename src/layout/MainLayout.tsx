import { ProConfigProvider, ProLayout } from "@ant-design/pro-components";
import { ConfigProvider } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import useGetMenus from "../hooks/useGetMenu";
import { ROUTER_DASHBOARD } from "../routes";
import { NotificationBell } from "@/components/common/shared/NotificationBell";

// Auth-related imports (commented out for now)
// import { Dropdown, Input, Tooltip } from "antd";
// import { Navigate, useNavigate } from "react-router-dom";
// import { LogoutOutlined } from "@ant-design/icons";
// import useAuthStore from "@/stores/authStore";
// import logo from "@/assets/logo.svg";
// import useLayoutStore from "@/stores/layoutStore";
// import en from "@/assets/en.svg";
// import vn from "@/assets/vn.svg";
// import { useEffect, useState } from "react";
// import { getGlobalSearch } from "@/apis/global_search/getGlobalSearch";
// import { useMutation } from "@tanstack/react-query";
// import { MODULE, OBJECT_TYPE } from "@/constant/slug";
// import { BsSlashSquare } from "react-icons/bs";
// import { logoutUser } from "@/apis/auth/logout";
// import { getFlag } from "@/utils/getFlag";

const MainLayout = () => {
  const location = useLocation();
  const menus = useGetMenus();

  // ========================================
  // AUTH LOGIC (COMMENTED OUT)
  // ========================================

  // const { t } = useTranslation();
  // const layoutState = useLayoutStore();
  // const authState = useAuthStore();
  // const { setUser } = useAuthStore((state) => state);
  // const [isFocused, setIsFocused] = useState(false);
  // const navigate = useNavigate();

  // Global search mutation
  // const { mutate: search, data: globalSearchData } = useMutation({
  //     mutationFn: (input: string) => getGlobalSearch({ input }),
  // });

  // Logout mutation
  // const { mutate: logoutMutation } = useMutation({
  //     mutationFn: logoutUser,
  //     onSuccess: () => {
  //         setUser(undefined);
  //         authState.setLogoutSuccess();
  //     },
  //     onError: (error) => {
  //         console.error("Logout API error:", error);
  //         setUser(undefined);
  //         authState.setLogoutSuccess();
  //     },
  // });

  // Handle global search navigation
  // useEffect(() => {
  //     if (globalSearchData?.data) {
  //         const module = MODULE[globalSearchData.data.module];
  //         const domain = globalSearchData.data.domain.join("/");
  //         const object = OBJECT_TYPE[globalSearchData.data.object];
  //         const tab = globalSearchData.data.tab ? `?tab=${globalSearchData.data.tab}` : "";
  //         const id = globalSearchData.data.id ? `/${globalSearchData.data.id}` : "";
  //         navigate(`/${module}${domain}/${object}${id}${tab}`);
  //     }
  // }, [globalSearchData?.data]);

  // Register service worker for notifications
  // useEffect(() => {
  //     if ("serviceWorker" in navigator) {
  //         navigator.serviceWorker
  //             .register("/firebase-messaging-sw.js")
  //             .then((registration) => console.log("Service Worker registered:", registration))
  //             .catch((err) => console.log("Service Worker registration failed:", err));
  //     }
  // }, []);

  // Handle search input
  // const handleSearch = (raw: string) => {
  //     const value = raw.trim();
  //     if (!value) return;
  //     search(value);
  // };

  // Handle logout
  // const logout = () => {
  //     logoutMutation();
  // };

  // Auth check - redirect to login if not authenticated
  // if (!authState.user) {
  //     return (
  //         <Navigate
  //             to={`/auth/login?redirect_url=${location.pathname}${location.search}`}
  //             replace
  //         />
  //     );
  // }

  // ========================================
  // END AUTH LOGIC
  // ========================================

  return (
    <div
      id="plm-layout"
      className="h-screen overflow-auto font-sans"
      style={{
        fontFamily:
          '"Lexend", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <ProConfigProvider hashed={false}>
        <ConfigProvider
          getTargetContainer={() => {
            return document.getElementById("plm-layout") || document.body;
          }}
          theme={{
            token: {
              fontFamily:
                '"Lexend", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontSize: 14,
              fontSizeHeading1: 24,
              fontSizeHeading2: 20,
              fontSizeHeading3: 18,
              fontSizeHeading4: 16,
              fontSizeHeading5: 14,
              fontSizeLG: 16,
              fontSizeSM: 12,
              fontSizeXL: 18,
            },
          }}
        >
          <ProLayout
            prefixCls="plm-layout"
            bgLayoutImgList={[
              {
                src: "https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png",
                left: 85,
                bottom: 100,
                height: "303px",
              },
              {
                src: "https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png",
                bottom: -68,
                right: -45,
                height: "303px",
              },
              {
                src: "https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png",
                bottom: 0,
                left: 0,
                width: "331px",
              },
            ]}
            route={{ path: "/", routes: menus }}
            location={location}
            token={{
              colorTextAppListIcon: "#ddd",
              colorTextAppListIconHover: "#fff",
              bgLayout: "#f6f7f9",
              header: {
                colorBgHeader: "#fff",
                colorHeaderTitle: "#306e51",
                colorTextRightActionsItem: "#000",
              },
              sider: {
                colorMenuBackground: "#306e51",
                colorBgMenuItemSelected: "#497a62",
                colorBgMenuItemCollapsedElevated: "#497a62",
                colorBgMenuItemHover: "#497a62",
                colorTextMenuSelected: "#fff",
                colorTextMenuItemHover: "#fff",
                colorTextMenu: "#fff",
                colorTextMenuActive: "#fff",
                colorTextSubMenuSelected: "#fff",
                colorBgMenuItemActive: "#497a62",
                colorTextCollapsedButton: "#306e51",
                colorTextMenuSecondary: "#fff",
                colorTextMenuTitle: "#fff",
                // colorTextCollapsedButtonHover: "#306e51",
                colorBgCollapsedButton: "#fff",
                colorMenuItemDivider: "#497a62",
                paddingInlineLayoutMenu: 0,
              },
              pageContainer: {
                paddingInlinePageContainerContent: 20,
                paddingBlockPageContainerContent: 10,
              },
            }}
            siderMenuType="sub"
            menu={{
              collapsedShowGroupTitle: true,
              defaultOpenAll: true,
              autoClose: false,
            }}
            avatarProps={{
              src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
              size: "small",
              title: "User",
            }}
            // Avatar dropdown (commented out - requires auth)
            // avatarProps={{
            //     src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
            //     size: "small",
            //     title: authState.user?.email?.split("@")[0],
            //     render: (_, dom) => {
            //         return (
            //             <Dropdown
            //                 menu={{
            //                     items: [
            //                         {
            //                             key: "logout",
            //                             icon: <LogoutOutlined />,
            //                             label: "Logout",
            //                             onClick: () => logout(),
            //                         },
            //                     ],
            //                 }}
            //             >
            //                 {dom}
            //             </Dropdown>
            //         );
            //     },
            // }}
            // App list (commented out - company specific)
            // appList={[...]
            title="Employee Management"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            headerTitleRender={(logo: any, title: any, _: any) => {
              const defaultDom = (
                <Link to={ROUTER_DASHBOARD} className="font-primary">
                  {logo}
                  {title}
                </Link>
              );
              if (typeof window === "undefined") return defaultDom;
              if (document.body.clientWidth < 1400) {
                return defaultDom;
              }
              if (_.isMobile) return defaultDom;
              return <>{defaultDom}</>;
            }}
            // Actions (search, notifications, language)
            actionsRender={() => {
              return [<NotificationBell key="notification" />];
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            menuFooterRender={(props: any) => {
              if (props?.collapsed) return undefined;
              return (
                <div
                  className="text-gray-300 font-primary"
                  style={{
                    textAlign: "center",
                    paddingBlockStart: 12,
                  }}
                >
                  <div>© 2025 Made with love</div>
                  <div>by Employee Management Team</div>
                </div>
              );
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            menuItemRender={(item: any, dom: any) => {
              const absoluteLinkRegex = /^https?:\/\//i;
              const isAbsoluteLink = absoluteLinkRegex.test(item.path || "/");

              return isAbsoluteLink ? (
                <a
                  href={item.path || "/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-primary"
                >
                  {dom}
                </a>
              ) : (
                <Link to={item.path || "/"} className="font-primary">
                  {dom}
                </Link>
              );
            }}
            fixSiderbar
            layout="mix"
            splitMenus={false}
          >
            <Outlet />
          </ProLayout>
        </ConfigProvider>
      </ProConfigProvider>
    </div>
  );
};

export default MainLayout;
