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
    </QueryClientProvider>
  </React.StrictMode>
);
