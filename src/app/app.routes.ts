import { Routes } from '@angular/router';
import { RegistroComponent } from './registro/registro.component';
import { DatosComponent } from './datos/datos.component';
import { LoginComponent } from './login/login.component';
import { GanadoComponent } from './ganado-engorde/ganado-engorde.component';

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
        path: 'ganado-engorde',
        component: GanadoComponent
    },

];

