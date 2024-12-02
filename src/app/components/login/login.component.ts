import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // se crea el formulario loginForm para el manejo de datos email y password del login
  loginForm = new FormGroup({
    // cada variable se usa para obtener el valor de cada input
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private router: Router, private firebaseService: FirebaseService) { }

  ngOnInit() {
    //this.obtenerDatosDB();
  }
  
  async obtenerDatosDB() {
    const listaGanado = await this.firebaseService.obtenerDatosDB("Ganado");
    console.log("listaGanado: ", listaGanado);
  }

  /**
   * Método para iniciar sesión con Google
   */
  loginGoogle() {
    this.firebaseService.autenticarGoogle();
  }

  /**
   * Método para manejar la acción del botón 'Iniciar Sesión'
   */
  login() {
    // se obtinen los datos de email y password para mostrarlos
    console.log('Correo: ' + this.loginForm.get('email')?.value, '\nContraseña: ' + this.loginForm.get('password')?.value);

    this.firebaseService.autenticarUsuario(this.loginForm.value);
    //this.router.navigate(['/finca']);
  }

  openWhatsApp() {
    const phoneNumber = '+50685075430'; 
    const message = encodeURIComponent('Hola, necesito ayuda con el sistema de Ganado Conectado.');
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
}


}
