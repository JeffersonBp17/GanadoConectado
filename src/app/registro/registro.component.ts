import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

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
    id: new FormControl(''),        // Número de Cédula
    password: new FormControl('')   // Contraseña
  });

  constructor(private router: Router) { }

  /**
   * Método para manejar la acción del botón 'Registrar'
   */
  onSubmit() {
    // se obtinen los datos de email y password para mostrarlos
    console.log('Nombre Completo: ' + this.registroForm.get('fullname')?.value, '\nCorreo Electrónico: ' + this.registroForm.get('email')?.value,
      '\nNúmero de Teléfono: ' + this.registroForm.get('phone')?.value, '\nNúmero de Cédula: ' + this.registroForm.get('id')?.value,
      '\nContraseña: ' + this.registroForm.get('password')?.value);

    this.router.navigate(['/datos']);
  }
}
