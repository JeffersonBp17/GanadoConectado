import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { HistorialPeso } from '../../types/HistorialPeso';
import { DocumentData, QuerySnapshot } from 'firebase/firestore';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, DatePipe],
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.scss'
})
export class DatosComponent implements OnInit {
  historialForm: FormGroup;
  estadoAgregar: boolean = true;
  historial: HistorialPeso[] | any = [];

  constructor(private fb: FormBuilder, public firebaseService: FirebaseService, private router: Router) {
    // Formulario para añadir peso y observaciones
    this.historialForm = this.fb.group({
      date: [''],
      weight: [''],
      observation: ['']
    });
  }

  ngOnInit(): void {
    this.obtenerHistorial();
    this.firebaseService.actualizarSnapshotHistorial();
    this.firebaseService.obsr_UpdatedSnapshot.subscribe((snapshot) => {
      this.updateHistorialCollection(snapshot);
    });
  }

  // Metodo para traer datos de db
  async obtenerHistorial() {
    const snapshot = await this.firebaseService.obtenerHistorialToro();
    console.log(snapshot);
    this.updateHistorialCollection(snapshot);
  }

  // Metodo para actualizar la tabla en tiempo real cuando se agrega o se elimina un registro
  updateHistorialCollection(snapshot: QuerySnapshot<DocumentData>) {
    this.historial = [];
    snapshot.docs.forEach((historial) => {
      console.log(historial.data());
      this.historial.push({ ...historial.data(), id: historial.id });
    });
    console.log(this.historial);
  }

  formatoFecha(segundos: number) {
    const date = new Date(0);
    date.setSeconds(segundos);
    return date;
  }

  volver() {
    this.router.navigateByUrl('/ganado');
  }

  // Función para agregar un registro de peso y observación a un toro específico
  async addWeightRecord() {    
    const val = this.firebaseService.crearHistorial(this.historialForm.value);
    if (await val) {
      this.estadoAgregar = !this.estadoAgregar;
      this.historialForm.reset();
    }
  }

  // Metodo para ocultar o mostrar la tabla
  cambiarEstado() {
    this.estadoAgregar = !this.estadoAgregar;
    this.historialForm.reset();
  }
}
