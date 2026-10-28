import React, { useState, useEffect } from 'react';
import { Navbar } from './components/landing/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { ServicesSection } from './components/landing/ServicesSection';
import { TechShowcase } from './components/landing/TechShowcase';
import { TestimonialsSection } from './components/landing/TestimonialsSection';
import { Footer } from './components/landing/Footer';
import { AgendaPage } from './components/agenda/AgendaPage';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminView } from './components/admin/AdminView';
import { useAdminAuth } from './hooks/useAdminAuth';
import { usePWA } from './hooks/usePWA';
import { ServiceType } from './types/appointment';

export function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    const path = window.location.pathname.replace(/\/+$/, '');
    return path || '/';
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>('Detección Especializada de Fugas');
  
  const { isAuthenticated, isLoading, error, loginWithPin, logout } = useAdminAuth();
  const { isInstallable, notificationsGranted, promptInstall, requestNotificationPermission } = usePWA();

  // Escuchar cambios de historial (botón atrás/adelante del navegador)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/\/+$/, '');
      setCurrentPath(path || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Redirigir hash #agendar/#agenda directamente a la ruta limpia /agenda
  useEffect(() => {
    if (window.location.hash === '#agendar' || window.location.hash === '#agenda') {
      window.history.replaceState({}, '', '/agenda');
      setCurrentPath('/agenda');
      window.scrollTo(0, 0);
    }
  }, []);

  // Abrir panel admin si está en la URL ?view=admin
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'admin') {
      setIsAdminOpen(true);
    }
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.replace(/\/+$/, '') || '/');
    window.scrollTo(0, 0);
  };

  const handleSelectService = (serviceTitle: string) => {
    setSelectedService(serviceTitle as ServiceType);
    navigateTo('/agenda');
  };

  const isAgendaRoute = currentPath === '/agenda' || currentPath === '/agendar';

  return (
    <div className="min-h-screen flex flex-col bg-white text-brand-dark selection:bg-brand-blue selection:text-white">
      {isAgendaRoute ? (
        /* Vista Exclusiva de Agenda Sin Distracciones */
        <AgendaPage
          onBackToHome={() => navigateTo('/')}
          initialService={selectedService}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      ) : (
        /* Vista Principal Completa */
        <>
          <Navbar
            onOpenAdmin={() => setIsAdminOpen(true)}
            onNavigateAgenda={() => navigateTo('/agenda')}
          />

          <main className="flex-grow">
            <HeroSection onNavigateAgenda={() => navigateTo('/agenda')} />
            <ServicesSection onSelectService={handleSelectService} />
            <TechShowcase onNavigateAgenda={() => navigateTo('/agenda')} />
            <TestimonialsSection />
          </main>

          <Footer
            onOpenAdmin={() => setIsAdminOpen(true)}
            onNavigateAgenda={() => navigateTo('/agenda')}
            onInstallPWA={promptInstall}
            isInstallable={isInstallable}
          />
        </>
      )}

      {/* Modal / Vista de Administrador */}
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
