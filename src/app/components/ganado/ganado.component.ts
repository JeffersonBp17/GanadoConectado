import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Livestock } from '../../types/LiveStock';
import { FirebaseService } from '../../services/firebase.service';
import { HeaderComponent } from "../header/header.component";
import { DocumentData, QuerySnapshot, Timestamp } from 'firebase/firestore';
import { Ganado } from '../../types/Ganado';
import { Finca } from '../../types/Finca';

@Component({
  selector: 'app-ganado',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent, DatePipe],
  templateUrl: './ganado.component.html',
  styleUrl: './ganado.component.scss'
})
export class GanadoComponent implements OnInit {
  livestockForm: FormGroup;
  weightForm: FormGroup;
  livestockList: Livestock[] = [];
  estadoAgregar: boolean = true;
  ganado: Ganado[] | any = [];
  finca: any | null | undefined;
  nombreFinca: string = '';

  constructor(private fb: FormBuilder, public firebaseService: FirebaseService) {
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

  ngOnInit(): void {
    try {
      const res = this.firebaseService.getItem('FincaActual');
      this.finca = res;
      this.finca = JSON.parse(this.finca);
      this.nombreFinca = this.finca.Nombre;
    } catch (error) {
      console.log("Error:", error)
    }
    
    this.obtenerGanado();
    this.firebaseService.actualizarSnapshotGanado();
    this.firebaseService.obsr_UpdatedSnapshot.subscribe((snapshot) => {
      this.updateGanadoCollection(snapshot);
    });
  }

  async obtenerGanado() {
    const snapshot = await this.firebaseService.obtenerGanadoFinca();
    console.log(snapshot);
    this.updateGanadoCollection(snapshot);
  }

  updateGanadoCollection(snapshot: QuerySnapshot<DocumentData>) {
    this.ganado = [];
    snapshot.docs.forEach((finca) => {
      console.log(finca.data());
      this.ganado.push({ ...finca.data(), id: finca.id });
    });
  }

  formatoFecha(segundos: number) {
    const date = new Date(0);
    date.setSeconds(segundos);
    return date;
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
