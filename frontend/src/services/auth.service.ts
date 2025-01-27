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

// export class AuthService {
//   private static TOKEN_KEY = 'mbong_token';
//   private static USER_KEY = 'mbong_user';

//   static async login(email: string, password: string): Promise<UserProfile> {
//     try {
//       // Simulation d'appel API
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });
      
//       if (!response.ok) throw new Error('Échec de connexion');
      
//       const data = await response.json();
//       this.setToken(data.token);
//       this.setUser(data.user);
//       return data.user;
//     } catch (error) {
//       throw new Error('Erreur de connexion');
//     }
//   }

//   static async register(formData: AuthFormData): Promise<UserProfile> {
//     try {
//       const response = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
      
//       if (!response.ok) throw new Error("Échec de l'inscription");
      
//       const data = await response.json();
//       this.setToken(data.token);
//       this.setUser(data.user);
//       return data.user;
//     } catch (error) {
//       throw new Error("Erreur lors de l'inscription");
//     }
//   }

//   static logout(): void {
//     localStorage.removeItem(this.TOKEN_KEY);
//     localStorage.removeItem(this.USER_KEY);
//   }

//   private static setToken(token: string): void {
//     localStorage.setItem(this.TOKEN_KEY, token);
//   }

//   private static setUser(user: UserProfile): void {
//     localStorage.setItem(this.USER_KEY, JSON.stringify(user));
//   }

//   static getUser(): UserProfile | null {
//     const user = localStorage.getItem(this.USER_KEY);
//     return user ? JSON.parse(user) : null;
//   }

//   static isAuthenticated(): boolean {
//     return !!localStorage.getItem(this.TOKEN_KEY);
//   }
// }