import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [],
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.scss'
})
export class DatosComponent {
  typeSelect: any = document.getElementById('type');
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
    if (this.tipoGanado === 'lechero') {
      this.router.navigate(['/ganado-lechero']);
      //lecheroFields.style.display = 'block';
      //engordeFields.style.display = 'none';
    } else {
      this.router.navigate(['/ganado-engorde']);
      //lecheroFields.style.display = 'none';
      //engordeFields.style.display = 'block';
    }

  }

}
