import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing').then(m => m.LandingPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.RegisterPage)
  },
  {
    path: 'menu',
    loadComponent: () => import('./pages/menu/menu').then(m => m.MenuPage)
  },
  {
    path: 'book-table',
    loadComponent: () => import('./pages/book-table/book-table').then(m => m.BookTablePage)
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then(m => m.CartPage)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardPage)
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/orders/orders').then(m => m.OrdersPage)
  },
  {
    path: 'bookings',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/bookings/bookings').then(m => m.BookingsPage)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile').then(m => m.ProfilePage)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/admin-layout').then(m => m.AdminLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/admin/dashboard/admin-dashboard').then(m => m.AdminDashboardPage)
      },
      {
        path: 'tables',
        loadComponent: () => import('./pages/admin/manage-tables/manage-tables').then(m => m.ManageTablesPage)
      },
      {
        path: 'foods',
        loadComponent: () => import('./pages/admin/manage-foods/manage-foods').then(m => m.ManageFoodsPage)
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/admin/manage-orders/manage-orders').then(m => m.ManageOrdersPage)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./pages/admin/manage-bookings/manage-bookings').then(m => m.ManageBookingsPage)
      },
      {
        path: 'customers',
        loadComponent: () => import('./pages/admin/customers/customers').then(m => m.CustomersPage)
      },
      {
        path: 'reports',
        loadComponent: () => import('./pages/admin/reports/reports').then(m => m.ReportsPage)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/admin/settings/settings').then(m => m.SettingsPage)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFoundPage)
  }
];
