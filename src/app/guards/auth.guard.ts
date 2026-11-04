import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { Toast } from '../services/toast';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const toast = inject(Toast);

  if (auth.isLoggedIn()) {
    return true;
  }

  toast.info('Please sign in to access this page.');
  return router.createUrlTree(['/login']);
};
