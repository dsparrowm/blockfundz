import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HowItWorks, Hero, OurTeam, TestimonialSection, Features, Pricing } from './sections';
import { Login, Contact, Register, AdminLogin } from './pages';
import Page from './app/dashboard/Page';
import { HomeLayout, DashboardLayout, AuthLayout, MainLayout } from './components/layout';
import TestToast from './pages/TestToast';
import NotFoundPage from './pages/NotFoundPage';
import PublicRoute from './helpers/protectRoutes'
import EmailVerificationPage from './pages/EmailVerificationPage';
import VerifiedEmailSuccessPage from './pages/VerifiedEmailSuccessPage';
import { Toaster } from "@/components/ui/sonner"
import LiveChat from './components/chat/liveChat';
import MaintenancePage from './components/MaintenancePage';

const App = () => {
  const maintenanceMode = false
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
            <HomeLayout>
              <section className="xl:padding-l padding-b bg-coral-black">
                <Hero />
              </section>
              {/* <section className="padding bg-coral-black text-white mb-20">
                <AboutUs />
              </section> */}
              <section id="service" className="padding-x py-1 bg-coral-black mb-20">
                <Features />
              </section>
              <section id='howitworks' className="padding bg-coral-black py-10 relative overflow-hidden mb-20">
                <HowItWorks />
              </section>
              <section id='about' className="padding-x py-10 mb-40">
                <OurTeam />
              </section>
              <section id='pricing' className="padding-x py-10 bg-coral-black mb-20">
                <Pricing />
              </section>
              <section className="padding-x py-1 pb-12 bg-coral-black mb-20">
                <TestimonialSection />
              </section>
            </HomeLayout>
          } />

          {/* Auth Routes */}
          <Route path="/login" element={<PublicRoute><AuthLayout><Login /></AuthLayout></PublicRoute>} />
          <Route path="/signup" element={<AuthLayout><Register /></AuthLayout>} />
          <Route path="/admin/login" element={<AuthLayout><AdminLogin /></AuthLayout>} />


          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout><Page /></DashboardLayout>} />
          <Route path="/admin/dashboard" element={<DashboardLayout><Page /></DashboardLayout>} />


          {/* Regular Pages */}
          <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/email-verified" element={<VerifiedEmailSuccessPage />} />

          {/* Test Page */}

          <Route path="/test" element={<TestToast />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
      <Toaster richColors position={"top-center"} />
      <LiveChat />
    </>
  );
};

export default App;