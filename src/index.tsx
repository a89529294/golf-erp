import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import { AuthLayout, authLoader } from "./layouts/auth-layout";
import Login from "./pages/login";
import RedirectToLoginIfNotAuthed from "./utils/redirect-to-login-if-not-authed";
import RedirectToIndexIfAuthed from "./utils/redirect-to-index-if-authed";
import Index from "./pages";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<AuthLayout />} loader={authLoader}>
        <Route element={<RedirectToIndexIfAuthed />}>
          <Route element={<Login />} path="/login" />
        </Route>

        <Route element={<RedirectToLoginIfNotAuthed />}>
          <Route index element={<Index />} />
        </Route>
      </Route>
    </>,
  ),
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </QueryClientProvider>
  </React.StrictMode>,
);
