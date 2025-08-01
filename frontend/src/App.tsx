import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Login, Contact, Register, AdminLogin, AdminChatPage } from './pages';
import TalkToSales from './pages/TalkToSales';
import Page from './app/dashboard/Page';
import { DashboardLayout, AuthLayout, MainLayout } from './components/layout';
import TestToast from './pages/TestToast';
import NotFoundPage from './pages/NotFoundPage';
import PublicRoute from './helpers/protectRoutes'
import EmailVerificationPage from './pages/EmailVerificationPage';
import VerifiedEmailSuccessPage from './pages/VerifiedEmailSuccessPage';
import { Toaster } from "@/components/ui/sonner"
import MaintenancePage from './components/MaintenancePage';
import ResetPassword from './pages/ResetPassword';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Landing from './components/Landing2/Landing';
import ProtectedSocketRoute from './components/ProtectedSocketRoute';

const App = () => {
  const maintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE;

  return (
    <>
      {maintenanceMode ? (
        <Routes>
          <Route path="*" element={<MaintenancePage />} />
        </Routes>
      ) : (
        <Routes>
          {/* Public Routes - No Socket Connection */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<PublicRoute><AuthLayout><Login /></AuthLayout></PublicRoute>} />
          <Route path="/signup" element={<AuthLayout><Register /></AuthLayout>} />
          <Route path="/admin/login" element={<AuthLayout><AdminLogin /></AuthLayout>} />
          <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/email-verified" element={<VerifiedEmailSuccessPage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/talk-to-sales" element={<TalkToSales />} />
          <Route path="/test" element={<TestToast />} />

          {/* Protected Routes - With Conditional Socket Connection */}
          <Route path="/dashboard" element={
            <ProtectedSocketRoute>
              <DashboardLayout>
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>}>
                  <Page />
                </Suspense>
              </DashboardLayout>
            </ProtectedSocketRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedSocketRoute>
              <DashboardLayout>
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>}>
                  <Page />
                </Suspense>
              </DashboardLayout>
            </ProtectedSocketRoute>
          } />
          <Route path="/admin/chat" element={
            <ProtectedSocketRoute>
              <DashboardLayout>
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>}>
                  <AdminChatPage />
                </Suspense>
              </DashboardLayout>
            </ProtectedSocketRoute>
          } />

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
      <Toaster />
    </>
  );
};

export default App;