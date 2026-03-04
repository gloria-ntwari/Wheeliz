import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { MacbookPro } from "./screens/MacbookPro";
import { Login } from "./screens/Login";
import { SignUp } from "./screens/SignUp";
import { AdminDashboard } from "./screens/AdminDashboard";
import { Kids } from "./screens/AdminDashboard/Kids";
import { KidDetail } from "./screens/AdminDashboard/KidDetail";
import { Comics } from "./screens/AdminDashboard/Comics";
import { AddComics } from "./screens/AdminDashboard/AddComics";
import { Submissions } from "./screens/AdminDashboard/Submissions";
import { ComicSubmissionsDetail } from "./screens/AdminDashboard/ComicSubmissionsDetail";
import { KidDashboard } from "./screens/KidDashboard/KidDashboard";
import { KidComics } from "./screens/KidDashboard/KidComics";
import { ComicView } from "./screens/AdminDashboard";
import { SetPassword } from "./screens/SetPassword/SetPassword";
import { ForgotPassword } from "./screens/ForgotPassword/ForgotPassword";
import { ResetPassword } from "./screens/ForgotPassword/ResetPassword";
import { KidComicDetail } from "./screens/KidDashboard/KidComicDetail";

// Protected Route Component for Admin
const ProtectedAdminRoute = ({ children }: { children: React.ReactElement }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/login" replace />;
};

// Protected Route Component for Kid
const ProtectedKidRoute = ({ children }: { children: React.ReactElement }) => {
  const token = localStorage.getItem("kidToken");
  return token ? children : <Navigate to="/login" replace />;
};

const container = document.getElementById("app") as HTMLElement;
// Ensure we only create the root once, even during Hot Module Replacement
const root = (container as any)._reactRoot || createRoot(container);
if (!(container as any)._reactRoot) {
  (container as any)._reactRoot = root;
}

root.render(
  <StrictMode>
    <Toaster richColors position="top-right" />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MacbookPro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
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
        <Route
          path="/admin/submissions/:comicId"
          element={
            <ProtectedAdminRoute>
              <ComicSubmissionsDetail />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/comics/view/:comicId"
          element={
            <ProtectedAdminRoute>
              <ComicView />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/kid/dashboard"
          element={
            <ProtectedKidRoute>
              <KidDashboard />
            </ProtectedKidRoute>
          }
        />
        <Route
          path="/kid/comics"
          element={
            <ProtectedKidRoute>
              <KidComics />
            </ProtectedKidRoute>
          }
        />
        <Route
          path="/kid/comics/:comicId"
          element={
            <ProtectedKidRoute>
              <KidComicDetail />
            </ProtectedKidRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
