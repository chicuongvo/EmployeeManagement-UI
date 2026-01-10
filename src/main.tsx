// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter, Route, Routes } from "react-router";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { UserProvider } from "./contexts/user/userContext.tsx";
// import "./index.css";
// import App from "./App.tsx";
// import Login from "./pages/Admin/Login.tsx";
// import Layout from "./components/Admin/Layout.tsx";
// import Dashboard from "./pages/Admin/Dashboard.tsx";

// const queryClient = new QueryClient();

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <UserProvider>
//         <BrowserRouter>
//           <Routes>
//             <Route path="/" element={<App />}></Route>

//             <Route path="/admin" element={<Layout />}></Route>

//             <Route path="/admin/login">
//               <Route index element={<Login />} />
//             </Route>
//             <Route path="/admin/dashboard" element={<Dashboard />}></Route>
//           </Routes>
//         </BrowserRouter>
//       </UserProvider>
//     </QueryClientProvider>
//   </StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Watermark } from "antd";
import App from "./App.tsx";

import "./index.css";
import "./styles/index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 30000,
      refetchOnReconnect: false,
    },
  },
});
import Login from "./pages/Admin/Login.tsx";
import Layout from "./components/Admin/Layout.tsx";
import Dashboard from "./pages/Admin/Dashboard.tsx";
import UpdateRequest from "./pages/Admin/UpdateRequest.tsx";
import Contract from "./pages/Admin/Contract.tsx";
import CreateUpdateRequest from "./pages/Employee/CreateUpdateRequest.tsx";
import VideoCall from "./pages/Employee/VideoCall.tsx";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      <Watermark
        content={
          import.meta.env.VITE_APP_ENV !== "prod"
            ? import.meta.env.VITE_APP_ENV
            : ""
        }
      >
        <App />
      </Watermark>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}></Route>

            <Route path="/admin" element={<Layout />}></Route>

            <Route path="/admin/login">
              <Route index element={<Login />} />
            </Route>
            <Route path="/admin/dashboard" element={<Dashboard />}></Route>

            <Route
              path="/admin/update-request"
              element={<UpdateRequest />}
            ></Route>

            <Route path="/admin/contract" element={<Contract />}></Route>

            <Route
              path="/employee/create-request"
              element={<CreateUpdateRequest />}
            ></Route>

            <Route path="/employee/video-call" element={<VideoCall />}></Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
