import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsAuthenticated } from "../store/authSlice";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
