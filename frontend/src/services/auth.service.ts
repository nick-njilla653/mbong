// src/services/auth.service.ts

import { UserProfile } from '../types/index';
const TEST_USERS = [
  {
    email: "test@mbong.com",
    password: "Test123!",
    profile: {
      id: "1",
      email: "test@mbong.com", 
      name: "Utilisateur Test",
      level: 1,
      xp: 0,
      streak: 0,
      completedLessons: [],
      dietaryPreferences: [],
      allergies: [],
      lastLoginDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
 ];
 
 export class AuthService {
  private static TOKEN_KEY = 'mbong_token';
  private static USER_KEY = 'mbong_user';
 
  static async login(email: string, password: string): Promise<UserProfile> {
    const user = TEST_USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
 
    // Mettre à jour la date de dernière connexion
    user.profile.lastLoginDate = new Date();
    user.profile.updatedAt = new Date();
 
    // Simuler un token JWT
    const token = btoa(JSON.stringify({userId: user.profile.id, email: user.email}));
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user.profile));
 
    return user.profile;
  }
 
  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
 
  static getUser(): UserProfile | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
 
  static isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
 }


/*  
// src/services/tokenService.ts
import { authService } from '../../API/api';

class TokenService {
  private refreshTokenTimeout?: NodeJS.Timeout;

  startTokenRefresh() {
    // Refresh token 5 minutes before expiration
    this.refreshTokenTimeout = setTimeout(async () => {
      try {
        const response = await authService.refreshToken();
        localStorage.setItem('token', response.data.token);
        this.startTokenRefresh(); // Schedule next refresh
      } catch (error) {
        // Logout user if refresh fails
        this.stopTokenRefresh();
        window.location.href = '/login';
      }
    }, this.getRefreshTime());
  }

  stopTokenRefresh() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  private getRefreshTime(): number {
    // Calculate time to refresh (20 minutes before expiration)
    const token = localStorage.getItem('token');
    if (!token) return 0;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    
    return Math.max(expirationTime - currentTime - (20 * 60 * 1000), 0);
  }
}

export default new TokenService(); */