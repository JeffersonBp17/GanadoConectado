import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { FirebaseService } from '../../services/firebase.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import { Finca } from '../../types/Finca';

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
  estadoAgregar: boolean = true;
  fincas: Finca[] | any = [];

  constructor(private fb: FormBuilder, private router: Router, private firebaseService: FirebaseService) {
    // Formulario para registrar la finca
    this.fincaForm = this.fb.group({
      Nombre: ['', Validators.required],
      TipoGanado: ['', Validators.required],
      NumeroFierro: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.obtenerFincas();
    this.firebaseService.obsr_UpdatedSnapshot.subscribe((snapshot) => {
      this.updateFincaCollection(snapshot);
    })
  }

  async obtenerFincas() {
    const snapshot = await this.firebaseService.obtenerFincasUsuario();
    this.updateFincaCollection(snapshot);
  }

  updateFincaCollection(snapshot: QuerySnapshot<DocumentData>) {
    this.fincas = [];
    snapshot.docs.forEach((finca) => {
      console.log("id",finca);
      this.fincas.push({ ...finca.data(), id: finca.id });
    })

    console.log("123: ",this.fincas);
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
    this.estadoAgregar = !this.estadoAgregar;
  }

  cambiarEstado() {
    this.estadoAgregar = !this.estadoAgregar;
  }
}
