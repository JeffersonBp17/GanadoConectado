import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  registroForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private firebaseService: FirebaseService) {
    // se crea el formulario registroForm para el manejo de datos del registro
    this.registroForm = this.fb.group({
      // cada variable se usa para obtener el valor de cada input
      Nombre: ['', Validators.required], //new FormControl('', Validators.required),  // Nombre Completo
      Correo: ['', [Validators.required, Validators.email]], //new FormControl('', [Validators.required, Validators.email]),     // Correo Electrónico
      Contrasena: ['', [Validators.required]], //new FormControl('', [Validators.required, Validators.minLength(8)])   // Contraseña
    });
  }

  /**
   * Método para manejar la acción del botón 'Registrar'
   */
  registrar() {
    console.log(this.registroForm.value);
    this.firebaseService.crearUsuario(this.registroForm.value);    
  }
}
