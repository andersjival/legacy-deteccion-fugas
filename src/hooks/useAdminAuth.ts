import { useState, useEffect } from 'react';
import { api } from '../services/api';

const AUTH_KEY = 'legacy_admin_token';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'authenticated';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithPin = async (pin: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const isValid = await api.verifyAdminPin(pin);
      if (isValid) {
        sessionStorage.setItem(AUTH_KEY, 'authenticated');
        setIsAuthenticated(true);
        return true;
      } else {
        setError('PIN incorrecto. Ingrese el código de 4 dígitos válido.');
        return false;
      }
    } catch {
      setError('Error al verificar el PIN.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    error,
    loginWithPin,
    logout
  };
}
