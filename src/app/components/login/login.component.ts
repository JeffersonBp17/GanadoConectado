import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // se crea el formulario loginForm para el manejo de datos email y password del login
  loginForm = new FormGroup({
    // cada variable se usa para obtener el valor de cada input
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private router: Router, private firebase: FirebaseService) { }

  ngOnInit() {
    //this.obtenerDatosDB();
  }
  
  async obtenerDatosDB() {
    const listaGanado = await this.firebase.obtenerDatosDB("Ganado");
    console.log("listaGanado: ", listaGanado);
  }
  login() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential:any = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  /**
   * Método para manejar la acción del botón 'Iniciar Sesión'
   */
  onSubmit() {
    // se obtinen los datos de email y password para mostrarlos
    console.log('Correo: ' + this.loginForm.get('email')?.value, '\nContraseña: ' + this.loginForm.get('password')?.value);

    this.router.navigate(['/datos']);
  }

}
