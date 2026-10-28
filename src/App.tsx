import React, { useState, useEffect } from 'react';
import { Navbar } from './components/landing/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { ServicesSection } from './components/landing/ServicesSection';
import { TechShowcase } from './components/landing/TechShowcase';
import { TestimonialsSection } from './components/landing/TestimonialsSection';
import { Footer } from './components/landing/Footer';
import { AgendaPage } from './components/agenda/AgendaPage';
import { ClientReviewPage } from './components/review/ClientReviewPage';
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

  const [selectedService, setSelectedService] = useState<ServiceType>('Detección Especializada de Fugas');
  
  const { isAuthenticated, isLoading, error, login, logout } = useAdminAuth();
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

  // Redirigir variantes /detec, /panel, /admin o ?view=admin a la ruta oficial /detec/panel
  useEffect(() => {
    const raw = window.location.pathname.replace(/\/+$/, '');
    if (raw === '/detec' || raw === '/panel' || raw === '/admin') {
      window.history.replaceState({}, '', '/detec/panel');
      setCurrentPath('/detec/panel');
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'admin') {
      window.history.replaceState({}, '', '/detec/panel');
      setCurrentPath('/detec/panel');
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
  const isAdminRoute = currentPath === '/detec/panel' || currentPath === '/detec' || currentPath === '/panel' || currentPath === '/admin';
  const isReviewRoute = currentPath === '/calificar' || currentPath === '/review' || currentPath === '/resena' || currentPath === '/valorar';

  return (
    <div className="min-h-screen flex flex-col bg-white text-brand-dark selection:bg-brand-blue selection:text-white">
      {isAdminRoute ? (
        /* RUTA EXCLUSIVA INDEPENDIENTE: /detec/panel */
        isAuthenticated ? (
          <AdminView
            onClose={() => navigateTo('/')}
            onLogout={() => {
              logout();
              navigateTo('/');
            }}
            onInstallPWA={promptInstall}
            onRequestNotifications={requestNotificationPermission}
            isInstallable={isInstallable}
            notificationsGranted={notificationsGranted}
          />
        ) : (
          <AdminLogin
            onLogin={login}
            onClose={() => navigateTo('/')}
            isLoading={isLoading}
            error={error}
          />
        )
      ) : isAgendaRoute ? (
        /* Vista Exclusiva de Agenda Sin Distracciones: /agenda */
        <AgendaPage
          onBackToHome={() => navigateTo('/')}
          initialService={selectedService}
          onOpenAdmin={() => navigateTo('/detec/panel')}
        />
      ) : isReviewRoute ? (
        /* Vista Exclusiva para Calificación de Clientes: /calificar */
        <ClientReviewPage onBackToHome={() => navigateTo('/')} />
      ) : (
        /* Vista Principal Completa: / */
        <>
          <Navbar
            onOpenAdmin={() => navigateTo('/detec/panel')}
            onNavigateAgenda={() => navigateTo('/agenda')}
          />

          <main className="flex-grow">
            <HeroSection onNavigateAgenda={() => navigateTo('/agenda')} />
            <ServicesSection onSelectService={handleSelectService} />
            <TechShowcase onNavigateAgenda={() => navigateTo('/agenda')} />
            <TestimonialsSection />
          </main>

          <Footer
            onOpenAdmin={() => navigateTo('/detec/panel')}
            onNavigateAgenda={() => navigateTo('/agenda')}
            onInstallPWA={promptInstall}
            isInstallable={isInstallable}
          />
        </>
      )}
    </div>
  );
}

export default App;
