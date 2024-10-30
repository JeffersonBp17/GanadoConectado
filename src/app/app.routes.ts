import { Routes } from '@angular/router';
import { RegistroComponent } from './components/registro/registro.component';
import { DatosComponent } from './components/datos/datos.component';
import { LoginComponent } from './components/login/login.component';
import { GanadoComponent } from './components/ganado/ganado.component';

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
        path: 'ganado',
        component: GanadoComponent
    },

];

