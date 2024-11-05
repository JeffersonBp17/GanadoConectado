import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token = '';

  constructor() { }

  isAuth() {
    return this.token.length > 0;
  }


}
