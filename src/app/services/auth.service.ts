import { Injectable } from '@angular/core';
import { getAuth } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token = 'a';

  constructor() { }

  async isAuth() {
    /*const auth = getAuth();
    const user = await auth.currentUser;

    console.log(auth, user);
    if (user) {
      // User is signed in, see docs for a list of available properties
      console.log("1", auth);
      return true;
    } else {
      // No user is signed in.
      console.log("2", auth);
      return false;
    }*/

    return this.token.length > 0;
  }


}
