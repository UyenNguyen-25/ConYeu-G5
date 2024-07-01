import flattenDeep from "lodash/flattenDeep";
import { Route, Routes as ReactRoutes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Prefetch from "@/auth/Prefetch";
// import ErrorBoundary from "@/components/common/Error";

const generateFlattenRoutes = (routes) => {
  if (!routes) return [];
  return flattenDeep(
    routes.map(({ routes: subRoutes, ...rest }) => [
      rest,
      generateFlattenRoutes(subRoutes),
    ])
  );
};

export const renderRoutes = (mainRoutes) => {
  const Routes = () => {
    const layouts = mainRoutes.map(
      ({ layout: Layout, isPublic, path, routes }, index) => {
        const subRoutes = generateFlattenRoutes(routes);
        return (
          <Route key={index} element={<Layout />} path={path}>
            <Route
              element={<ProtectedRoute isPublic={isPublic} routes={routes} />}
            >
              <Route element={<Prefetch />}>
                {subRoutes.map(({ component: Component, path, name }) => {
                  return (
                    Component &&
                    path && (
                      <Route key={name} element={<Component />} path={path} />
                    )
                  );
                })}
              </Route>
            </Route>
          </Route>
        );
      }
    );
    return <ReactRoutes>{layouts}</ReactRoutes>;
  };
  return Routes;
};
