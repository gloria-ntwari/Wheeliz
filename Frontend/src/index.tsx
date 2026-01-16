import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MacbookPro } from "./screens/MacbookPro";
import { Login } from "./screens/Login";
import { RoleSelection } from "./screens/RoleSelection";
import { KidLogin } from "./screens/KidLogin";
import { AdminDashboard } from "./screens/AdminDashboard";
import { Kids } from "./screens/AdminDashboard/Kids";
import { KidDetail } from "./screens/AdminDashboard/KidDetail";
import { Comics } from "./screens/AdminDashboard/Comics";

// Protected Route Component for Admin
const ProtectedAdminRoute = ({ children }: { children: React.ReactElement }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/login" replace />;
};

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MacbookPro />} />
        <Route path="/login" element={<RoleSelection />} />
        <Route path="/login/admin" element={<Login />} />
        <Route path="/login/kid" element={<KidLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/kids"
          element={
            <ProtectedAdminRoute>
              <Kids />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/kids/:kidId"
          element={
            <ProtectedAdminRoute>
              <KidDetail />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/comics"
          element={
            <ProtectedAdminRoute>
              <Comics />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
