import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-finca',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './finca.component.html',
  styleUrl: './finca.component.scss'
})
export class FincaComponent {
  tipoGanado: string = 'lechero';

  constructor(private router: Router) {

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

  crearFinca() {   
      this.router.navigate(['/ganado']);
      //lecheroFields.style.display = 'none';
      //engordeFields.style.display = 'block';
    
  }
}
