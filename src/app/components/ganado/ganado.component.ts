import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Livestock } from '../../types/LiveStock';

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

  constructor(private fb: FormBuilder) {
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
