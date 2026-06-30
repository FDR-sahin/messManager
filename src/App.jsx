import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

import Login from "./pages/Login";
import NoticeBoard from "./pages/NoticeBoard";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMembers from "./pages/admin/AdminMembers";
import AdminExpenses from "./pages/admin/AdminExpenses";
import AdminBills from "./pages/admin/AdminBills";

import MemberDashboard from "./pages/member/MemberDashboard";
import MemberExpenses from "./pages/member/MemberExpenses";
import MemberBills from "./pages/member/MemberBills";

// RootRedirect: "/" e ele user-er role onujayi thik dashboard e pathiye dey
function RootRedirect() {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" replace />;
  return <Navigate to={isAdmin ? "/admin/dashboard" : "/member/dashboard"} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RootRedirect />} />

        {/* Admin Routes */}
        <Route
          element={
            <ProtectedRoute adminOnly>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/members" element={<AdminMembers />} />
          <Route path="/admin/expenses" element={<AdminExpenses />} />
          <Route path="/admin/bills" element={<AdminBills />} />
          <Route path="/admin/notices" element={<NoticeBoard />} />
        </Route>

        {/* Member Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/member/dashboard" element={<MemberDashboard />} />
          <Route path="/member/expenses" element={<MemberExpenses />} />
          <Route path="/member/bills" element={<MemberBills />} />
          <Route path="/member/notices" element={<NoticeBoard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
