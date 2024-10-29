import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

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

  constructor(private router: Router) { }

  /**
   * Método para manejar la acción del botón 'Iniciar Sesión'
   */
  onSubmit() {
    // se obtinen los datos de email y password para mostrarlos
    console.log('Correo: ' + this.loginForm.get('email')?.value, '\nContraseña: ' + this.loginForm.get('password')?.value);

    this.router.navigate(['/datos']);
  }

}
