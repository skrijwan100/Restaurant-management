import { Injectable, signal, computed, inject } from '@angular/core';
import { Storage } from './storage';
import { User } from '../models/user.model';
import { Toast } from './toast';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private storage = inject(Storage);
  private toast = inject(Toast);
  private router = inject(Router);

  currentUser = signal<User | null>(this.storage.getCurrentUser());
  users = signal<User[]>(this.storage.getUsers());

  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');
  userName = computed(() => this.currentUser()?.name ?? 'Guest');
  userAvatar = computed(() => this.currentUser()?.avatar ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  login(email: string, _password?: string): boolean {
    const allUsers = this.storage.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    
    // Check if user exists
    let match = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!match && cleanEmail.includes('admin')) {
      match = allUsers.find(u => u.role === 'admin');
    }

    if (match) {
      this.currentUser.set(match);
      this.storage.setCurrentUser(match);
      this.toast.success(`Welcome back, ${match.name}!`, 'Signed In');
      return true;
    }

    this.toast.error('Invalid email or password. Try demo accounts below!', 'Login Failed');
    return false;
  }

  loginWithGoogle(): void {
    // Premium simulated Google OAuth login
    const allUsers = this.storage.getUsers();
    const guestUser = allUsers.find(u => u.role === 'customer') || allUsers[0];
    this.currentUser.set(guestUser);
    this.storage.setCurrentUser(guestUser);
    this.toast.success(`Connected with Google as ${guestUser.name}`, 'Google Sign-In');
    this.router.navigate(['/dashboard']);
  }

  demoLogin(role: 'admin' | 'customer'): void {
    const allUsers = this.storage.getUsers();
    const user = role === 'admin' 
      ? allUsers.find(u => u.role === 'admin') 
      : allUsers.find(u => u.role === 'customer');

    if (user) {
      this.currentUser.set(user);
      this.storage.setCurrentUser(user);
      this.toast.info(`Switched to demo ${role.toUpperCase()} account: ${user.name}`);
      if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  register(userData: { name: string; email: string; phone: string; address: string; password?: string }): boolean {
    const allUsers = this.storage.getUsers();
    if (allUsers.some(u => u.email.toLowerCase() === userData.email.trim().toLowerCase())) {
      this.toast.error('An account with this email already exists', 'Registration Error');
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      role: 'customer',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      joinedDate: new Date().toISOString().split('T')[0],
      favoriteFoodIds: ['food-1', 'food-16'],
      loyaltyPoints: 100
    };

    const updated = [newUser, ...allUsers];
    this.storage.setUsers(updated);
    this.users.set(updated);
    this.currentUser.set(newUser);
    this.storage.setCurrentUser(newUser);

    this.toast.success(`Account created successfully! 100 welcome points added.`, 'Welcome to Savoria');
    this.router.navigate(['/dashboard']);
    return true;
  }

  updateProfile(updates: Partial<User>): void {
    const current = this.currentUser();
    if (!current) return;

    const updatedUser = { ...current, ...updates };
    this.currentUser.set(updatedUser);
    this.storage.setCurrentUser(updatedUser);

    const allUsers = this.storage.getUsers().map(u => u.id === current.id ? updatedUser : u);
    this.storage.setUsers(allUsers);
    this.users.set(allUsers);

    this.toast.success('Your profile has been updated.', 'Profile Saved');
  }

  logout(): void {
    this.currentUser.set(null);
    this.storage.setCurrentUser(null);
    this.toast.info('You have been signed out safely.');
    this.router.navigate(['/login']);
  }
}
