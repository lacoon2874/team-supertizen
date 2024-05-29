import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "routes/Router";
import { ThemeProvider } from "styled-components";
import { theme } from "@/styles/theme";
import { GlobalStyles } from "@/styles/reset";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
// serviceWorkerRegistration.register();

const queryClient = new QueryClient(); //2번

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />
    </ThemeProvider>
  </QueryClientProvider>
);
