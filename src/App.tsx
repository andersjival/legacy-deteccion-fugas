import React, { useState, useEffect } from 'react';
import { Navbar } from './components/landing/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { ServicesSection } from './components/landing/ServicesSection';
import { TechShowcase } from './components/landing/TechShowcase';
import { BookingWizard } from './components/landing/booking/BookingWizard';
import { TestimonialsSection } from './components/landing/TestimonialsSection';
import { Footer } from './components/landing/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminView } from './components/admin/AdminView';
import { useAdminAuth } from './hooks/useAdminAuth';
import { usePWA } from './hooks/usePWA';
import { ServiceType } from './types/appointment';

export function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>('Detección Especializada de Fugas');
  
  const { isAuthenticated, isLoading, error, loginWithPin, logout } = useAdminAuth();
  const { isInstallable, notificationsGranted, promptInstall, requestNotificationPermission } = usePWA();

  // Abrir panel admin automáticamente si en la URL está ?view=admin
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'admin') {
      setIsAdminOpen(true);
    }
  }, []);

  const handleSelectService = (serviceTitle: string) => {
    setSelectedService(serviceTitle as ServiceType);
    const element = document.getElementById('agendar');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-brand-dark selection:bg-brand-blue selection:text-white">
      {/* 1. Navbar Glassmorphic */}
      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* 2. Landing Page Completa */}
      <main className="flex-grow">
        <HeroSection />
        <ServicesSection onSelectService={handleSelectService} />
        <TechShowcase />
        <BookingWizard initialService={selectedService} />
        <TestimonialsSection />
      </main>

      {/* 3. Footer Corporativo */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onInstallPWA={promptInstall}
        isInstallable={isInstallable}
      />

      {/* 4. Panel de Administrador / Login de Seguridad */}
      {isAdminOpen && (
        isAuthenticated ? (
          <AdminView
            onClose={() => setIsAdminOpen(false)}
            onLogout={() => {
              logout();
              setIsAdminOpen(false);
            }}
            onInstallPWA={promptInstall}
            onRequestNotifications={requestNotificationPermission}
            isInstallable={isInstallable}
            notificationsGranted={notificationsGranted}
          />
        ) : (
          <AdminLogin
            onLogin={loginWithPin}
            onClose={() => setIsAdminOpen(false)}
            isLoading={isLoading}
            error={error}
          />
        )
      )}
    </div>
  );
}

export default App;
