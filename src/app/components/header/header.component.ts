import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private router: Router, public firebaseService: FirebaseService) { }

  /**
   * Función para cerrar sesión
   */
  logOut() {
    this.firebaseService.cerrarSesionUsuario();    
  }

}
