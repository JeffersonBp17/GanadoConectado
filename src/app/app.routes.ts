import { Routes } from '@angular/router';
import { RegistroComponent } from './components/registro/registro.component';
import { DatosComponent } from './components/datos/datos.component';
import { LoginComponent } from './components/login/login.component';
import { GanadoComponent } from './components/ganado/ganado.component';
import { authGuard } from './guards/auth.guard';
import { NoEncontradoComponent } from './components/no-encontrado/no-encontrado.component';
import { FincaComponent } from './components/finca/finca.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: "/login",
        pathMatch: "full"
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "datos",
        component: DatosComponent,
        canActivate: [authGuard]
    },
    {
        path: "finca",
        component: FincaComponent,
        canActivate: [authGuard]
    },
    {
        path: 'registro',
        component: RegistroComponent
    },
    {
        path: 'ganado',
        component: GanadoComponent,
        canActivate: [authGuard]
    },
    {
        path: '**',
        component: NoEncontradoComponent
    }

];

