// frontend/src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import LoadingIndicator from "../components/Loading"; // Make sure you have this component

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingIndicator />; // Or any other loading spinner
  }

  if (!isAuthenticated) {
    // You can also pass the current location to redirect back after login
    // const location = useLocation();
    // return <Navigate to="/login" state={{ from: location }} replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;