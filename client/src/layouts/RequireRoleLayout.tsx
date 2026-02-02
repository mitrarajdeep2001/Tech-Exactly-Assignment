import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";

interface Props {
  allowedRoles: ("ADMIN" | "USER")[];
}

const RequireRole = ({ allowedRoles }: Props) => {
  const { user, loading } = useAppSelector((state) => state.auth);

  if (loading) return null;

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireRole;
