import { Component, OnInit } from '@angular/core';
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
export class FincaComponent implements OnInit{
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

  ngOnInit(): void {
    this.obtenerFincas();
    this.firebaseService.actualizarSnapshotFinca();
    this.firebaseService.obsr_UpdatedSnapshot.subscribe((snapshot) => {
      this.updateFincaCollection(snapshot);
    });
  }

  async obtenerFincas() {
    const snapshot = await this.firebaseService.obtenerFincasUsuario();
    this.updateFincaCollection(snapshot);
  }

  updateFincaCollection(snapshot: QuerySnapshot<DocumentData>) {
    this.fincas = [];
    snapshot.docs.forEach((finca) => {
      this.fincas.push({ ...finca.data(), id: finca.id });
    });
  }

  onTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const type = selectElement.value;
    this.tipoGanado = type;
  }

  // Metodo para crear Finca
  async crearFinca() {
    const val = this.firebaseService.crearFinca(this.fincaForm.value);
    if (await val) {
      this.estadoAgregar = !this.estadoAgregar;
      this.fincaForm.reset();
    }    
  }

  // Metodo para seleccionar finca
  seleccionarFinca(finca: Finca) {
    this.firebaseService.setItem("FincaActual", JSON.stringify(finca));
    this.firebaseService.setItem("IDFierro", finca.NumeroFierro);
    this.firebaseService.idFierro = finca.NumeroFierro;
    this.router.navigate(['/ganado']);    
  }

  // Metodo para eliminar finca
  eliminarFinca() {

  }

  // Metodo para cambiar estado agregar finca o ver fincas
  cambiarEstado() {
    this.estadoAgregar = !this.estadoAgregar;
  }
}
