import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";

const PublicLayout = () => {
  const { isAuthenticated, loading, user } = useAppSelector(
    (state) => state.auth
  );

  if (loading) return null; // or loader

  return isAuthenticated ? (
    user?.role === "ADMIN" ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/feed" replace />
  ) : (
    <Outlet />
  );
};

export default PublicLayout;
