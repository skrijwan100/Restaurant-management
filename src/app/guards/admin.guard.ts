import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { Toast } from '../services/toast';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const toast = inject(Toast);

  if (auth.isAdmin()) {
    return true;
  }

  toast.warning('Admin access required. Please sign in with an admin account.');
  return router.createUrlTree(['/login']);
};
