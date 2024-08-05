import { linksKV } from "@/utils/links";
import { PermissionGuard } from "@/utils/permission-guard";
import { queryClient } from "@/utils/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Toaster } from "sonner";
import "./index.css";
import { AuthLayout, authLoader } from "./layouts/auth-layout";
import DashboardLayout from "./layouts/dashboard-layout";
import Index from "./pages";
import Login from "./pages/login";
import RedirectToIndexIfAuthed from "./utils/redirect-to-index-if-authed";
import RedirectToLoginIfNotAuthed from "./utils/redirect-to-login-if-not-authed";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<AuthLayout />} loader={authLoader}>
        <Route element={<RedirectToIndexIfAuthed />}>
          <Route element={<Login />} path="/login" />
        </Route>

        <Route element={<RedirectToLoginIfNotAuthed />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Index />} />
            {Object.values(linksKV["driving-range"].subLinks).map((subLink) => {
              return subLink.type === "multiple" ? (
                Object.values(subLink.paths).map((pathConfig, idx) => {
                  let path = "";
                  if (typeof pathConfig === "object")
                    path = pathConfig.symbolicPath;
                  else path = pathConfig;

                  return (
                    <Route
                      element={
                        <PermissionGuard
                          routePermissions={subLink.allowedPermissions}
                          storeCategory="ground"
                        />
                      }
                      key={path}
                    >
                      <Route
                        path={path}
                        lazy={Object.values(subLink.lazy)[idx]}
                      />
                    </Route>
                  );
                })
              ) : (
                <Route
                  element={
                    <PermissionGuard
                      routePermissions={subLink.allowedPermissions}
                      storeCategory="ground"
                    />
                  }
                  key={subLink.path}
                >
                  <Route path={subLink.path} lazy={subLink.lazy} />
                </Route>
              );
            })}
            {Object.values(linksKV["golf"].subLinks).map((subLink) => {
              return subLink.type === "multiple" ? (
                Object.values(subLink.paths).map((pathConfig, idx) => {
                  let path = "";
                  if (typeof pathConfig === "object")
                    path = pathConfig.symbolicPath;
                  else path = pathConfig;
                  return (
                    <Route
                      element={
                        <PermissionGuard
                          routePermissions={subLink.allowedPermissions}
                          storeCategory="golf"
                        />
                      }
                      key={path}
                    >
                      <Route
                        path={path}
                        lazy={Object.values(subLink.lazy)[idx]}
                      />
                    </Route>
                  );
                })
              ) : (
                <Route
                  element={
                    <PermissionGuard
                      routePermissions={subLink.allowedPermissions}
                      storeCategory="golf"
                    />
                  }
                  key={subLink.path}
                >
                  <Route path={subLink.path} lazy={subLink.lazy} />
                </Route>
              );
            })}
            {Object.values(linksKV["indoor-simulator"].subLinks).map(
              (subLink) => {
                return subLink.type === "multiple" ? (
                  Object.values(subLink.paths).map((pathConfig, idx) => {
                    let path = "";
                    if (typeof pathConfig === "object")
                      path = pathConfig.symbolicPath;
                    else path = pathConfig;

                    return (
                      <Route
                        element={
                          <PermissionGuard
                            routePermissions={subLink.allowedPermissions}
                            storeCategory="simulator"
                          />
                        }
                        key={path}
                      >
                        <Route
                          path={path}
                          lazy={Object.values(subLink.lazy)[idx]}
                        />
                      </Route>
                    );
                  })
                ) : (
                  <Route
                    element={
                      <PermissionGuard
                        routePermissions={subLink.allowedPermissions}
                        storeCategory="simulator"
                      />
                    }
                    key={subLink.path}
                  >
                    <Route path={subLink.path} lazy={subLink.lazy} />
                  </Route>
                );
              },
            )}
            {Object.values(linksKV["system-management"].subLinks).flatMap(
              (subLink) => {
                return subLink.type === "multiple" ? (
                  Object.values(subLink.paths).map((path, idx) => {
                    return (
                      <Route
                        element={
                          <PermissionGuard
                            routePermissions={subLink.allowedPermissions}
                          />
                        }
                        key={path}
                      >
                        <Route
                          path={path}
                          lazy={Object.values(subLink.lazy)[idx]}
                        />
                      </Route>
                    );
                  })
                ) : (
                  <Route
                    element={
                      <PermissionGuard
                        routePermissions={subLink.allowedPermissions}
                      />
                    }
                    key={subLink.path}
                  >
                    <Route path={subLink.path} lazy={subLink.lazy} />
                  </Route>
                );
              },
            )}
            {(
              Object.entries(linksKV["store-management"].paths) as [
                keyof (typeof linksKV)["store-management"]["paths"],
                string,
              ][]
            ).map(([key, path]) => (
              <Route
                element={
                  <PermissionGuard
                    routePermissions={
                      linksKV["store-management"].allowedPermissions
                    }
                  />
                }
                key={key}
              >
                <Route
                  path={path}
                  lazy={linksKV["store-management"].lazy[key]}
                />
              </Route>
            ))}
            {(
              Object.entries(linksKV["member-management"].paths) as [
                keyof (typeof linksKV)["member-management"]["paths"],
                string,
              ][]
            ).map(([key, path]) => (
              <Route
                element={
                  <PermissionGuard
                    routePermissions={
                      linksKV["member-management"].allowedPermissions
                    }
                  />
                }
                key={key}
              >
                <Route
                  path={path}
                  lazy={linksKV["member-management"].lazy[key]}
                />
              </Route>
            ))}
          </Route>
        </Route>
      </Route>
    </>,
  ),
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors={true} theme="light" visibleToasts={1} />
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </QueryClientProvider>
  </React.StrictMode>,
);
