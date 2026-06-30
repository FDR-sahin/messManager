// =====================================================================
// PROTECTED ROUTE
// =====================================================================
// Eta wrapper component, kono page-ke "protect" korar jonno use hoy.
// Jodi user login na thake -> login page e pathiye dey
// Jodi adminOnly={true} dewa thake kintu user admin na -> member dashboard e pathiye dey
// =====================================================================

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/member/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
