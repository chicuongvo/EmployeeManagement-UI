import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./contexts/user/userContext.tsx";
import "./index.css";
import App from "./App.tsx";
import Login from "./pages/Admin/Login.tsx";
import Layout from "./components/Admin/Layout.tsx";
import Dashboard from "./pages/Admin/Dashboard.tsx";
import UpdateRequest from "./pages/Admin/UpdateRequest.tsx";
import Contract from "./pages/Admin/Contract.tsx";
import CreateUpdateRequest from "./pages/Employee/CreateUpdateRequest.tsx";
import VideoCall from "./pages/Employee/VideoCall.tsx";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
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
  </StrictMode>
);
