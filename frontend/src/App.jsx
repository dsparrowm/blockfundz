import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HowItWorks, Hero, AboutUs, OurTeam, TestimonialSection, Features, Pricing, FAQSection } from './sections';
import { Login, About, Contact, Register, AdminLogin } from './pages';
import Page from './app/dashboard/Page';
import { HomeLayout, DashboardLayout, AuthLayout, MainLayout } from './components/layout';
import { Toaster } from "sonner"
import TestToast from './pages/TestToast';
import NotFoundPage from './pages/NotFoundPage';
import PublicRoute from './helpers/protectRoutes' 

const App = () => {
  return (
    <>
      <Toaster richColors position={"top-center"} />
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

        <Route path="/test" element={<TestToast />} />
          
          {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;