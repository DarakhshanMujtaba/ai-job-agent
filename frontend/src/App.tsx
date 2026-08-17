import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import ApplicationDetailPage from "@/pages/ApplicationDetailPage";
import ApplicationsTrackerPage from "@/pages/ApplicationsTrackerPage";

function AuthRoute() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <AuthPage />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthRoute />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell>
              <DashboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <AppShell>
              <ApplicationsTrackerPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications/:id"
        element={
          <ProtectedRoute>
            <AppShell>
              <ApplicationDetailPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#111827",
              color: "#eef1f9",
              border: "1px solid #232b3d",
              borderRadius: "12px",
              fontSize: "13px",
              boxShadow: "0 20px 50px -20px rgba(0,0,0,0.6)",
            },
            success: {
              iconTheme: { primary: "#3ecf8e", secondary: "#111827" },
            },
            error: {
              iconTheme: { primary: "#f2545b", secondary: "#111827" },
            },
          }}
        />
      </DataProvider>
    </AuthProvider>
  );
}
