import { inject, Injectable } from '@angular/core';
import { getAuth } from "firebase/auth";
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token = 'a';
  authService = inject(FirebaseService);

  constructor() { }

  async isAuth() {
    const usuario = this.authService.getItem("Usuario");
    if (usuario) {
      console.log("1");
      return true;
    } else {
      // No user is signed in.
      console.log("2");
      return false;
    }
  }


}
