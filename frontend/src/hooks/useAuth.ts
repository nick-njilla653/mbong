// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { AuthService } from '../services/auth.service';
import { UserProfile, AuthFormData } from '../types/index';

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = AuthService.getUser();
    if (storedUser) setUser(storedUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await AuthService.login(email, password);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData: AuthFormData) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await AuthService.register(formData);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return { user, loading, error, login, register, logout };
};