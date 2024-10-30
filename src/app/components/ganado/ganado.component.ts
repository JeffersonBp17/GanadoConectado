import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { Livestock } from '../../types/Livestock';

@Component({
  selector: 'app-ganado',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './ganado.component.html',
  styleUrl: './ganado.component.scss'
})
export class GanadoComponent {
  livestockForm: FormGroup;
  weightForm: FormGroup;
  livestockList: Livestock[] = [];

  constructor(private fb: FormBuilder, private firebase: FirebaseService) {
    // Formulario para registrar el toro
    this.livestockForm = this.fb.group({
      toroId: [''],
      purchaseDate: [''],
      purchaseWeight: [''],
      purchaseLocation: [''],
      arrivalWeight: [''],
      batchNumber: ['']
    });

    // Formulario para añadir peso y observaciones
    this.weightForm = this.fb.group({
      date: [''],
      weight: [''],
      observation: ['']
    });
  }

  // Función para agregar ganado
  addLivestock() {
    const newLivestock: Livestock = {
      ...this.livestockForm.value,
      weightRecords: [] // Inicializa un array vacío para los registros de peso
    };
    this.livestockList.push(newLivestock);
    this.livestockForm.reset();

    this.firebase.agregarGanado(this.livestockList[0]);
    //console.log(this.livestockList,this.livestockList[0], this.livestockForm.value);
    
  }

  // Función para agregar un registro de peso y observación a un toro específico
  addWeightRecord(toroId: string) {
    const livestock = this.livestockList.find(l => l.toroId === toroId);
    if (livestock) {
      livestock.weightRecords.push(this.weightForm.value);
      this.weightForm.reset();
    }
  }
}
