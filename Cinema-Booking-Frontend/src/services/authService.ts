import { mockUsers } from '@/data/mockUsers';
import type { AuthUser } from '@/types';
import { delay } from './mockStore';

const DEMO_SESSION_KEY = 'cinematix_demo_user';

const toPublicUser = (user: (typeof mockUsers)[number]): AuthUser => ({
  id: user.id,
  _id: user._id,
  email: user.email,
  username: user.username,
  fullName: user.fullName,
  role: user.role,
  avatarUrl: user.avatarUrl,
});

// THIS IS FRONTEND MOCK AUTHENTICATION ONLY.
// TODO STUDENT BACKEND INTEGRATION
//
// Replace this mock implementation with Express.js authentication,
// password hashing, HTTP-only cookie delivery, auth middleware, and
// backend authorization. Do not treat frontend route guards as security.
export const authService = {
  async login(email: string, password: string) {
    await delay();
    const user = mockUsers.find((item) => item.email === email && item.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const publicUser = toPublicUser(user);
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(publicUser));
    return publicUser;
  },

  async adminLogin(usernameOrEmail: string, password: string) {
    await delay();
    const user = mockUsers.find(
      (item) =>
        item.role === 'admin' &&
        (item.email === usernameOrEmail || item.username === usernameOrEmail) &&
        item.password === password,
    );
    if (!user) {
      throw new Error('Invalid admin credentials');
    }
    const publicUser = toPublicUser(user);
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(publicUser));
    return publicUser;
  },

  async register(email: string, _password: string, fullName: string) {
    await delay();
    if (mockUsers.some((item) => item.email === email)) {
      throw new Error('A demo user with this email already exists');
    }
    const id = `user-${Date.now()}`;
    const user = {
      id,
      _id: id,
      email,
      fullName,
      role: 'user' as const,
      password: _password,
    };
    mockUsers.push(user);
    return toPublicUser(user);
  },

  async logout() {
    await delay(150);
    localStorage.removeItem(DEMO_SESSION_KEY);
  },

  getCurrentUser() {
    const storedUser = localStorage.getItem(DEMO_SESSION_KEY);
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      localStorage.removeItem(DEMO_SESSION_KEY);
      return null;
    }
  },
};
