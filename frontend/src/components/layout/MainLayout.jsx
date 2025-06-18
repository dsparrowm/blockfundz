import { useLocation } from 'react-router-dom';
import Nav from '@/components/Nav';
import { Footer } from '@/sections';

export const MainLayout = ({ children, withNav = true, withFooter = true, className = "" }) => {
  const location = useLocation();
  const hideNav = ['/login', '/signup', '/admin/dashboard', '/dashboard', '/admin/login'].includes(location.pathname);

  return (
    <main className={`relative text-black ${className}`}>
      {withNav && !hideNav && <Nav />}
      {children}
      {withFooter && (
        <section className="padding-x bg-gray-800/50 pt-12 pb-8">
          <Footer />
        </section>
      )}
    </main>
  );
};