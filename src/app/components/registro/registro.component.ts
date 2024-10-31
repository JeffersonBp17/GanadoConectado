import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  // se crea el formulario registroForm para el manejo de datos del registro
  registroForm = new FormGroup({
    // cada variable se usa para obtener el valor de cada input
    fullname: new FormControl(''),  // Nombre Completo
    email: new FormControl(''),     // Correo Electrónico
    phone: new FormControl(''),     // Número de Teléfono
    password: new FormControl('')   // Contraseña
  });

  constructor(private router: Router, private firebase: FirebaseService) { }

  /**
   * Método para manejar la acción del botón 'Registrar'
   */
  onSubmit() {
    console.log(this.registroForm.value);
    this.firebase.registrarUsuario(this.registroForm.value);

    this.router.navigate(['/datos']);
  }
}
