import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Contact } from './pages';
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
import Login from './components/landinPage/authPages/Login';
import Signup from './components/landinPage/authPages/Signup';
import AdminLogin from './components/landinPage/authPages/AdminLogin';
import ForgotPassword from './components/landinPage/authPages/ForgotPassword';
import ResetPasswordNew from './components/landinPage/authPages/ResetPassword';
import EmailVerificationPageNew from './components/landinPage/authPages/EmailVerificationPage';
import VerifiedEmailSuccessPageNew from './components/landinPage/authPages/VerifiedEmailSuccessPage';
import Landing from './components/landinPage/Landing';

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
          <Route path="/signup" element={<AuthLayout><Signup /></AuthLayout>} />
          <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
          <Route path="/admin/login" element={<AuthLayout><AdminLogin /></AuthLayout>} />
          <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
          <Route path="/verify-email" element={<EmailVerificationPageNew />} />
          <Route path="/email-verified" element={<VerifiedEmailSuccessPageNew />} />
          <Route path="/reset-password/:token" element={<ResetPasswordNew />} />

          <Route path="/talk-to-sales" element={<TalkToSales />} />
          <Route path="/test" element={<TestToast />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <DashboardLayout>
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>}>
                <Page />
              </Suspense>
            </DashboardLayout>
          } />
          <Route path="/admin/dashboard" element={
            <DashboardLayout>
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>}>
                <Page />
              </Suspense>
            </DashboardLayout>
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