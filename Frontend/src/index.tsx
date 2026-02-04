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
import { AddComics } from "./screens/AdminDashboard/AddComics";
import { Submissions } from "./screens/AdminDashboard/Submissions";

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
        <Route
          path="/admin/add-comics"
          element={
            <ProtectedAdminRoute>
              <AddComics />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/submissions"
          element={
            <ProtectedAdminRoute>
              <Submissions />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
