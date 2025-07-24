import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HowItWorks, Hero, OurTeam, TestimonialSection, Features, Pricing } from './sections';
import { Login, Contact, Register, AdminLogin, AdminChatPage } from './pages';
import Page from './app/dashboard/Page';
import { HomeLayout, DashboardLayout, AuthLayout, MainLayout } from './components/layout';
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

const App = () => {
  const maintenanceMode = false;

  return (
    <>
      {maintenanceMode ? (
        <Routes>
          <Route path="*" element={<MaintenancePage />} />
        </Routes>
      ) : (
        <Routes>
          {/* Home Page with all sections */}
          <Route path="/" element={
            // <HomeLayout>
            //   <section className="xl:padding-l padding-b bg-coral-black">
            //     <Hero />
            //   </section>
            //   {/* <section className="padding bg-coral-black text-white mb-20">
            //     <AboutUs />
            //   </section> */}
            //   <section id="service" className="padding-x py-1 bg-coral-black mb-20">
            //     <Features />
            //   </section>
            //   <section id='howitworks' className="padding bg-coral-black py-10 relative overflow-hidden mb-20">
            //     <HowItWorks />
            //   </section>
            //   <section id='about' className="padding-x py-10 mb-40">
            //     <OurTeam />
            //   </section>
            //   <section id='pricing' className="padding-x py-10 bg-coral-black mb-20">
            //     <Pricing />
            //   </section>
            //   <section className="padding-x py-1 pb-12 bg-coral-black mb-20">
            //     <TestimonialSection />
            //   </section>
            //   <section id='crypto-news' className="padding-x py-1 bg-coral-black mb-20">
            //     <CryptoNewsSection />
            //   </section>
            // </HomeLayout>
            <Landing />
          } />

          {/* Auth Routes */}
          <Route path="/login" element={<PublicRoute><AuthLayout><Login /></AuthLayout></PublicRoute>} />
          <Route path="/signup" element={<AuthLayout><Register /></AuthLayout>} />
          <Route path="/admin/login" element={<AuthLayout><AdminLogin /></AuthLayout>} />

          {/* Dashboard Routes */}
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
          <Route path="/admin/chat" element={
            <DashboardLayout>
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>}>
                <AdminChatPage />
              </Suspense>
            </DashboardLayout>
          } />


          {/* Regular Pages */}
          <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/email-verified" element={<VerifiedEmailSuccessPage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes */}

          {/* Test Page */}
          <Route path="/test" element={<TestToast />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />


          {/* Regular Pages */}
          <Route path="/contact" element={
            <MainLayout>
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>}>
                <Contact />
              </Suspense>
            </MainLayout>
          } />
          <Route path="/verify-email" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>}>
              <EmailVerificationPage />
            </Suspense>
          } />
          <Route path="/email-verified" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>}>
              <VerifiedEmailSuccessPage />
            </Suspense>
          } />
          <Route path="/reset-password/:token" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>}>
              <ResetPassword />
            </Suspense>
          } />

          {/* Protected Routes */}

          {/* Test Page */}
          <Route path="/test" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>}>
              <TestToast />
            </Suspense>
          } />

          {/* 404 Page */}
          <Route path="*" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>}>
              <NotFoundPage />
            </Suspense>
          } />
        </Routes>
      )}
      <Toaster />
    </>
  );
};

export default App;