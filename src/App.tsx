// import { Outlet } from "react-router";
// import Navbar from "./components/Client/Navbar";
// import ScrollToTop from "./components/ScrollToTop";
// import { ToastContainer } from "react-toastify";
// import Footer from "./components/Client/Footer";

// function App() {
//   return (
//     <div className="font-primary dark:bg-gray-800 ">
//       <ScrollToTop />
//       <Navbar />
//       <main className="max-w-7xl min-h-dvh mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <Outlet />
//       </main>
//       <ToastContainer theme="colored" />
//       <Footer />
//     </div>
//   );
// }


// export default App;

import { ConfigProvider } from "antd";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { useEffect } from "react";
import { Toaster } from "sonner";

import viVN from "antd/es/locale/vi_VN";
import enUS from "antd/es/locale/en_US";

import { getRoutes } from "@/routes";
import useLayoutStore from "@/stores/layoutStore";
import "dayjs/locale/vi";

const basename = document.querySelector("base")?.getAttribute("href") ?? "/";

function App() {
  const lang = useLayoutStore((state) => state.lang);
  // const { i18n } = useTranslation();

  // useEffect(() => {
  //   void i18n.changeLanguage(lang);
  // }, [lang, i18n]);

  const router = createBrowserRouter(getRoutes(), { basename });

  return (
    <ConfigProvider locale={lang === "vi" ? viVN : enUS}>
      <Toaster richColors position="top-center" />
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
