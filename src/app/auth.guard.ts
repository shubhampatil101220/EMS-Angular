import { CanActivateFn, Router } from '@angular/router';
import { LoginAuthService } from './services/login-auth.service';
import { inject } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';

export const authGuard: CanActivateFn = (route, state) => {
  let service = inject(LoginAuthService)
  let router = inject(Router)
  let toast = inject(NgToastService)
  if(service.isLoggedIn()){
    return true;  
  }else{
    toast.error({detail:'Error',summary:'You are not Logged In',duration:8000});
    router.navigate(['/']);
  }
  return false;
};

