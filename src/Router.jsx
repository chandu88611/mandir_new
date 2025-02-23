import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Skeleton } from "antd";

import { publicRoutes, protectedRoutes } from "./routes";
import PublicLayout from "./layout/PublicLayout";
import ProtectedLayout from "./layout/ProtectedLayout";
// import AuthProvider from "./providers/AuthProvider";

const Router = () => {
  return (
    // <AuthProvider>
    <Routes>
      {/** Public Routes **/}
      <Route element={<PublicLayout />}>
        {publicRoutes.map((route, i) => {
          return (
            <Route
              key={`public-${i}`}
              path={route.path}
              element={
                <Suspense fallback={<Skeleton />}>
                  <route.element />
                </Suspense>
              }
            />
          );
        })}
      </Route>

      <Route path="/" element={<ProtectedLayout />}>
        {protectedRoutes.map((route, i) => {
          return (
            <Route
              key={`protected-${i}`}
              path={route.path}
              element={
                <Suspense fallback={<Skeleton />}>
                  <route.element />
                </Suspense>
              }
            />
          );
        })}
      </Route>
    </Routes>
    // </AuthProvider>
  );
};

export default Router;
