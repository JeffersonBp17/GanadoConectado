import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { environment } from '../../environments/environment';
import { collection, getDocs, addDoc, getFirestore, query, where } from "firebase/firestore"; // conexion base de datos
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Usuario } from '../types/Usuario';
import { Ganado } from '../types/Ganado';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Finca } from '../types/Finca';

const app = initializeApp(environment.firebaseConfig);

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public uid: string = ''; // ID de usuario
  public idFierro: string = ';'

  constructor(private router: Router) { }

  /**
   * Función para inicializar la conexión con la base de datos
   * @returns retorna la conexión
   */
  private initializeDb() {
    const db = getFirestore(app);
    return db;
  }

  /**
   * Función para crear usuario
   * @param datos 
   */
  async crearUsuario(datos: any) {
    try {
      // registro de usuario en base de datos
      console.log(datos);

      const usuario: Usuario = {
        Nombre: datos.Nombre,
        Correo: datos.Correo,
        Contrasena: datos.Contrasena,
      };
      const docRef = await addDoc(collection(this.initializeDb(), "Usuario"), usuario);
      console.log("Document written with ID: ", docRef.id);

      // registro de usuario en autenticacion
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, datos.Correo, datos.Contrasena)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log(userCredential);
          this.autenticarUsuario(datos)
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

  /**
   * Función para agregar Finca
   * @param datos 
   */
  async crearFinca(datos: any) {
    try {
      const finca: Finca = {
        Nombre: datos.Nombre,
        TipoGanado: datos.TipoGanado,
        IDUsuario: this.getItem("UID") || this.uid,
        NumeroFierro: datos.NumeroFierro,
      }
      const docRef = await addDoc(collection(this.initializeDb(), "Finca"), finca);

      this.setItem("IDFierroFinca", datos.NumeroFierro);
      this.idFierro = this.getItem("IDFierroFinca") || datos.NumeroFierro;

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  /**
   * Función para agregar datos a base de datos
   */
  async crearGanado(datos: any) {
    try {
      console.log("Ganado: ",datos, this.getItem("IDFierroFinca"), Number (this.getItem("IDFierroFinca")), Number (this.idFierro));
      const [año, mes, dia] = datos.purchaseDate.split('-');
      let fecha = new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
      console.log(fecha);

      const ganado: Ganado = {
        IDFierroFinca: Number (this.getItem("IDFierroFinca")) || Number (this.idFierro),
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


  /**
   * Función para login de usuario
   * @param datos 
   */
  async autenticarUsuario(datos: any) {
    try {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, datos.Correo, datos.Contrasena)
        .then(async (userCredential: any) => {
          console.log(userCredential);
          let result = await this.buscarUsuario("Usuario", userCredential.user.email);
          // guardar en localstorage
          this.setItem("Usuario", JSON.stringify(result[0]));
          this.setItem("UID", userCredential.user.uid);
          this.uid = this.getItem("UID") || userCredential.user.uid;

          let mensaje = `Bienvenido ${result[0].Nombre}!!!`;
          Swal.fire({
            title: "Inicio de sesión exitoso",
            text: mensaje,
            icon: "success"
          });

          this.router.navigate(['/finca']);
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

  /**
   * Función para login de usuario con Google
   * @param datos 
   */
  async autenticarGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then(async (userCredential: any) => {
        console.log(userCredential);
        // Token de acceso de Google
        const credential: any = GoogleAuthProvider.credentialFromResult(userCredential);
        const token = credential.accessToken;
        const user = userCredential.user;

        let result = await this.buscarUsuario("Usuario", userCredential.user.email);
        // guardar en localstorage
        this.setItem("Usuario", JSON.stringify(result[0]));
        this.setItem("UID", userCredential.user.uid);
        this.uid = this.getItem("UID") || userCredential.user.uid;

        console.log("RES: ", result, result.length);
        // registrar usuario en base de datos
        if (result.length < 1) {
          const usuario: Usuario = {
            Nombre: userCredential.user.displayName,
            Correo: userCredential.user.email,
          };
          await addDoc(collection(this.initializeDb(), "Usuario"), usuario);
        }
        let mensaje = `Bienvenido ${userCredential.user.displayName}!!!`;
        Swal.fire({
          title: "Inicio de sesión exitoso",
          text: mensaje,
          icon: "success"
        });

        this.router.navigate(['/finca']);

      }).catch((error) => { // manejo de errores
        let mensaje = `Datos incorrectos.`;
        Swal.fire({
          title: "Error de auntenticación",
          text: mensaje,
          icon: "error"
        });
        console.log("Error: ", error);
      });
  }

  /**
   * Función para cerrar sesión de usuario
   */
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
      console.log("Error: ", error);
    });
  }

  async obtenerGanadoFinca() {
    let result: any[] = [];
    const querySnapshot = await getDocs(collection(this.initializeDb(), "Ganado"));
    querySnapshot.forEach((doc) => {
      result.push(doc.data());
    });
    console.log(result);
    return result;
  }

  /**
   * Funcion para obtener datos de la base de datos
   * @param collectionName variable para especificar nombre del collection en bd
   * @returns retorna la lista de datos
   */
  async obtenerDatosDB(collectionName: string) {
    let result: any[] = [];
    const querySnapshot = await getDocs(collection(this.initializeDb(), collectionName));
    querySnapshot.forEach((doc) => {
      result.push(doc.data());
    });
    console.log(result);
    return result;
  }

  /**
   * Funcion para buscar usuario
   */
  async buscarUsuario(collectionName: string, email: string) {
    let result: any[] = [];
    const q = query(collection(this.initializeDb(), collectionName), where("Correo", "==", email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      result.push(doc.data());
    });

    console.log("Result: ", result);
    return result;
  }


  // Set a value in local storage
  setItem(key: string, value: any): void {
    localStorage.setItem(key, value);
  }

  // Get a value from local storage
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  // Remove a value from local storage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all items from local storage
  clear(): void {
    localStorage.clear();
  }
}
