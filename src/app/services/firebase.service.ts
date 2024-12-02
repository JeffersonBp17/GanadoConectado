import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { environment } from '../../environments/environment';
import { collection, getDocs, addDoc, getFirestore } from "firebase/firestore"; // conexion base de datos
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Usuario } from '../types/Usuario';
import { Ganado } from '../types/Ganado';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

const app = initializeApp(environment.firebaseConfig);

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private router: Router) { }

  /**
   * Función para inicializar la conexión con la base de datos
   * @returns retorna la conexión
   */
  private initializeDb() {
    const db = getFirestore(app);
    return db;
  }

  async registrarUsuario(datos: any) {
    try {
      // registro de usuario en base de datos
      console.log(datos);

      const usuario: Usuario = {
        Nombre: datos.fullname,
        Correo: datos.email,
        Contrasena: datos.password,
      };
      const docRef = await addDoc(collection(this.initializeDb(), "Usuario"), usuario);
      console.log("Document written with ID: ", docRef.id);

      // registro de usuario en autenticacion
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, datos.email, datos.password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log(userCredential);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error, errorCode, errorMessage)
          // ..
        });

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async autenticarUsuario(datos: any) {
    try {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, datos.email, datos.password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log(userCredential);

          let mensaje = `Bienvenido ${datos.email}!!!`;
          Swal.fire({
            title: "Inicio de sesión exitoso",
            text: mensaje,
            icon: "success"
          });

          this.router.navigate(['/finca']);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error, errorCode, errorMessage);

          let mensaje = `Datos incorrectos, correo o contraseña inválida.`;
          Swal.fire({
            title: "Error de auntenticación",
            text: mensaje,
            icon: "error"
          });
        });
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  async autenticarGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        // Token de acceso de Google
        const credential: any = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;

        let mensaje = `Bienvenido ${result.user.displayName}!!!`;
        Swal.fire({
          title: "Inicio de sesión exitoso",
          text: mensaje,
          icon: "success"
        });

        this.router.navigate(['/finca']);

      }).catch((error) => { // manejo de errores
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);

        let mensaje = `Datos incorrectos.`;
          Swal.fire({
            title: "Error de auntenticación",
            text: mensaje,
            icon: "error"
          });
      });
  }

  async cerrarSesionUsuario() {
    const auth = getAuth();
    signOut(auth).then(() => {
      let mensaje = 'Cerrando sesión';
      Swal.fire({
        position: "top-end",
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
        title: mensaje,
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        this.router.navigate(['/']);
      });
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

  /**
   * Funcion para obtener datos de la base de datos
   * @param collectionName variable para especificar nombre del collection en bd
   * @returns retorna la lista de datos
   */
  async obtenerDatosDB(collectionName: string) {
    const querySnapshot = await getDocs(collection(this.initializeDb(), collectionName));
    let dbData: any[] = [];
    querySnapshot.forEach((doc) => {
      dbData.push(doc.data());
    });

    return dbData;
  }

  /**
   * Función para agregar datos a base de datos
   */
  async agregarGanado(datos: any) {
    try {
      //console.log(datos);
      const [año, mes, dia] = datos.purchaseDate.split('-');
      let fecha = new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
      console.log(fecha);

      const ganado: Ganado = {
        FechaCompra: fecha,
        LugarCompra: datos.purchaseLocation,
        NumeroLote: datos.batchNumber,
        NumeroToro: datos.toroId,
        PesoCompra: datos.purchaseWeight,   
      }
      const docRef = await addDoc(collection(this.initializeDb(), "Ganado"), ganado);

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
}
