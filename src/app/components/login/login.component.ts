import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private firebaseService: FirebaseService) {
    // se crea el formulario loginForm para el manejo de datos email y password del login
    this.loginForm = fb.group({
      // cada variable se usa para obtener el valor de cada input
      Correo: ['', Validators.required], //new FormControl('', [Validators.required, Validators.email]),     // Correo Electrónico
      Contrasena: ['', Validators.required],
    });
  }

  obtenerDatosDB() {
    this.firebaseService.obtenerDatosDB("Usuario").then((data) => {
      console.log("Data: ", data);
    });
    //console.log("listaGanado: ", listaGanado);
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
