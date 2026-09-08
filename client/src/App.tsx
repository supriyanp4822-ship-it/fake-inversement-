import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './context/authStore';
import { Navigation, Footer } from './components/Layout';
import { ProtectedRoute } from './routes/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { InvestmentsPage } from './pages/InvestmentsPage';
import { ReportsPage } from './pages/ReportsPage';
import { ReportGovernmentPage } from './pages/ReportGovernmentPage';
import { FraudReportDetailsPage } from './pages/FraudReportDetailsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ReportTrackingPage } from './pages/ReportTrackingPage';
import { WebsiteCheckPage } from './pages/WebsiteCheckPage';
import { ReportPreviewPage } from './pages/ReportPreviewPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminRoute } from './routes/AdminRoute';

// Auth routes that should NOT show the shared nav/footer
const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];

const AppLayout = () => {
  const location = useLocation();
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname);

  return (
    <>
      {!isAuthRoute && <Navigation />}
      <main className={isAuthRoute ? '' : 'min-h-screen'}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/investments"
            element={
              <ProtectedRoute>
                <InvestmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report-government/:id?"
            element={
              <ProtectedRoute>
                <ReportGovernmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report-details/:id"
            element={
              <ProtectedRoute>
                <FraudReportDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report-preview/:id"
            element={
              <ProtectedRoute>
                <ReportPreviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route path="/track" element={<ReportTrackingPage />} />
          <Route path="/track/:id" element={<ReportTrackingPage />} />
          <Route path="/website-check" element={<WebsiteCheckPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAuthRoute && <Footer />}
    </>
  );
};

function App() {
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, []);

  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
