import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { FirebaseService } from '../../services/firebase.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-finca',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule],
  templateUrl: './finca.component.html',
  styleUrl: './finca.component.scss'
})
export class FincaComponent {
  tipoGanado: string = 'lechero';
  fincaForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private firebaseService: FirebaseService) {
    // Formulario para registrar la finca
    this.fincaForm = this.fb.group({
      Nombre: ['', Validators.required],
      TipoGanado: ['', Validators.required],
      NumeroFierro: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  onTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const type = selectElement.value;
    console.log('Tipo seleccionado:', type);
    this.tipoGanado = type;
    // Aquí puedes agregar la lógica que necesites según el valor seleccionado.
    //const type = this.typeSelect.value;
  }

  // Metodo para crear Finca
  crearFinca() {
    console.log("Value: ", this.fincaForm.value);
    this.firebaseService.crearFinca(this.fincaForm.value);

    this.router.navigate(['/ganado']);
    //lecheroFields.style.display = 'none';
    //engordeFields.style.display = 'block';
  }
}
