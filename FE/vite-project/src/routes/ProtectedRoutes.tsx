import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  // TODO: Use authentication token
  const localStorageToken: string | null = localStorage.getItem("token");

  return localStorageToken ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoutes;
