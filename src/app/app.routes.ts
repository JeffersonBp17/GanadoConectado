import { Routes } from '@angular/router';
import { RegistroComponent } from './registro/registro.component';
import { DatosComponent } from './datos/datos.component';
import { LoginComponent } from './login/login.component';
import { GanadoLecheroComponent } from './ganado-lechero/ganado-lechero.component';
import { GanadoEngordeComponent } from './ganado-engorde/ganado-engorde.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: "login",
        pathMatch: "full"
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "datos",
        component: DatosComponent
    },
    {
        path: 'registro',
        component: RegistroComponent
    },
    {
        path: 'ganado-lechero',
        component: GanadoLecheroComponent
    },
    {
        path: 'ganado-engorde',
        component: GanadoEngordeComponent
    },

];

