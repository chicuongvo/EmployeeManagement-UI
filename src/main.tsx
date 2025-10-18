import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./contexts/user/userContext.tsx";
import "./index.css";
import App from "./App.tsx";
import Login from "./pages/Admin/Login.tsx";
import Layout from "./components/Admin/Layout.tsx";

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
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>
);
