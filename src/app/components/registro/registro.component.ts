import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  // se crea el formulario registroForm para el manejo de datos del registro
  registroForm = new FormGroup({
    // cada variable se usa para obtener el valor de cada input
    fullname: new FormControl('', Validators.required),  // Nombre Completo
    email: new FormControl('', [Validators.required, Validators.email]),     // Correo Electrónico
    password: new FormControl('', [Validators.required, Validators.minLength(8)])   // Contraseña
  });

  constructor(private router: Router, private firebaseService: FirebaseService) { }

  /**
   * Método para manejar la acción del botón 'Registrar'
   */
  onSubmit() {
    console.log(this.registroForm.value);
    this.firebaseService.registrarUsuario(this.registroForm.value);

    this.router.navigate(['/finca']);
  }
}
