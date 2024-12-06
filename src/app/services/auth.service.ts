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
    //const auth = getAuth();
    //const user = await auth.currentUser;
    const usuario = this.authService.getItem("Usuario");
    console.log(usuario);
    if (usuario) {
      // User is signed in, see docs for a list of available properties
      console.log("1");
      return true;
    } else {
      // No user is signed in.
      console.log("2");
      return false;
    }

    //return this.token.length > 0;
  }


}
