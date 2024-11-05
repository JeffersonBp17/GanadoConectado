import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuth()) {
    return true;
  } else {
    let mensaje = 'Usuario no está logueado o se venció la sesión, debe iniciar sesión';
    Swal.fire({
      title: "Error",
      text: mensaje,
      icon: "error"
    });
    //router.navigateByUrl('/login');
    const urlTreeReturn = router.createUrlTree(['/login']);
    return urlTreeReturn;
  }
};
