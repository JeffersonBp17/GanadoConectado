import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { Livestock } from '../../types/LiveStock';
import { FirebaseService } from '../../services/firebase.service';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-ganado',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, HeaderComponent],
  templateUrl: './ganado.component.html',
  styleUrl: './ganado.component.scss'
})
export class GanadoComponent {
  livestockForm: FormGroup;
  weightForm: FormGroup;
  livestockList: Livestock[] = [];
  estadoAgregar: boolean = true;

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService) {
    // Formulario para registrar el toro
    this.livestockForm = this.fb.group({
      toroId: ['', Validators.required],
      purchaseDate: ['', Validators.required],
      purchaseWeight: ['', Validators.required],
      purchaseLocation: ['', Validators.required],
      batchNumber: ['', Validators.required]
    });

    // Formulario para añadir peso y observaciones
    this.weightForm = this.fb.group({
      date: [''],
      weight: [''],
      observation: ['']
    });
  }

  cargarGanado() {
    this.firebaseService.obtenerGanadoFinca().then((data) => {
      console.log("Data: ", data);
    })
    //console.log("listaGanado: ", listaGanado);
  }

  // Función para agregar ganado
  addLivestock() {
    const newLivestock: Livestock = {
      ...this.livestockForm.value,
      weightRecords: [] // Inicializa un array vacío para los registros de peso
    };
    this.livestockList.push(newLivestock);
    this.livestockForm.reset();

    this.firebaseService.crearGanado(this.livestockList[0]);
    //console.log(this.livestockList,this.livestockList[0], this.livestockForm.value);

    this.estadoAgregar = !this.estadoAgregar;
  }

  // Función para agregar un registro de peso y observación a un toro específico
  addWeightRecord(toroId: string) {
    const livestock = this.livestockList.find(l => l.toroId === toroId);
    if (livestock) {
      livestock.weightRecords.push(this.weightForm.value);
      this.weightForm.reset();
    }
  }

  cambiarEstado() {
    this.estadoAgregar = !this.estadoAgregar;
  }

}
