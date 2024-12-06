import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { environment } from '../../environments/environment';
import { collection, getDocs, addDoc, getFirestore, query, where, CollectionReference, DocumentData, QuerySnapshot, Firestore, onSnapshot, DocumentReference, doc, deleteDoc, orderBy } from "firebase/firestore"; // conexion base de datos
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Usuario } from '../types/Usuario';
import { Ganado } from '../types/Ganado';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Finca } from '../types/Finca';
import { Subject } from 'rxjs';
import { HistorialPeso } from '../types/HistorialPeso';

const app = initializeApp(environment.firebaseConfig);

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public uid: string = ''; // ID de usuario
  public idFierro: number = 0; // Numero de Fierro actual
  public idToro: number = 0;

  db: Firestore;
  usuarioCol: CollectionReference<DocumentData>; // consulta db usuario
  fincaCol: CollectionReference<DocumentData>; // consulta para manejar la tabla/coleccion de fincas
  ganadoCol: CollectionReference<DocumentData>; // consulta db ganado 
  historialCol: CollectionReference<DocumentData>; // Referencia a la tabla historial;

  //fincaDoc: DocumentReference<DocumentData>;
  //ganadoDoc: DocumentReference<DocumentData>;

  private updatedSnapshot = new Subject<QuerySnapshot<DocumentData>>();
  obsr_UpdatedSnapshot = this.updatedSnapshot.asObservable();

  constructor(private router: Router) {
    initializeApp(environment.firebaseConfig);
    this.db = getFirestore();
    this.usuarioCol = collection(this.db, 'Usuario');
    this.fincaCol = collection(this.db, 'Finca');
    this.ganadoCol = collection(this.db, 'Ganado');
    this.historialCol = collection(this.db, 'Historial');

    //this.fincaDoc = doc(this.db, 'Finca');
    //this.ganadoDoc = doc(this.db, 'ganado');
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
      const docRef = await addDoc(this.usuarioCol, usuario);
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
  async crearFinca(datos: any): Promise<boolean> {
    try {
      // Validar si ya existe una finca con el numero de fierro
      const q = query(this.fincaCol, where("NumeroFierro", "==", datos.NumeroFierro));
      const querySnapshot = await getDocs(q);
      let result: any[] = [];
      querySnapshot.forEach((doc) => {
        result.push(doc.data());
      });

      if (result.length < 1) {
        const finca: Finca = {
          Nombre: datos.Nombre,
          TipoGanado: datos.TipoGanado,
          IDUsuario: this.getItem("UID") || this.uid,
          NumeroFierro: datos.NumeroFierro,
        }
        const docRef = await addDoc(this.fincaCol, finca);
        let mensaje = `Finca creada exitosamente, fierro número ${datos.NumeroFierro}.`;
        Swal.fire({
          title: "Éxito",
          text: mensaje,
          icon: "success"
        });
        console.log("Document written with ID: ", docRef.id);
        return true;
      } else {
        let mensaje = `Ya existe una Finca con el numero de fierro ${result[0].NumeroFierro}.`;
        Swal.fire({
          title: "Error al agregar Finca",
          text: mensaje,
          icon: "error"
        });
        return false
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      return false;
    }
  }

  /**
   * Función para agregar ganado
   */
  async crearGanado(datos: any): Promise<boolean> {
    try {
      // Validar si ya existe un toro con el numero de Toro
      const querySnapshot = await getDocs(query(this.ganadoCol, where("IDFierroFinca", "==", Number(this.getItem("IDFierro")) || Number(this.idFierro)),
        where("NumeroToro", "==", datos.toroId)));
      let result: any[] = [];
      querySnapshot.forEach((doc) => {
        result.push(doc.data());
      });
      console.log("RESULT: ", result, Number(this.getItem("IDFierro")) || Number(this.idFierro), datos.toroId);
      if (result.length < 1) {
        const [año, mes, dia] = datos.purchaseDate.split('-');
        let fecha = new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
        const ganado: Ganado = {
          IDFierroFinca: Number(this.getItem("IDFierro")) || Number(this.idFierro),
          FechaCompra: fecha,
          LugarCompra: datos.purchaseLocation,
          NumeroLote: datos.batchNumber,
          NumeroToro: datos.toroId,
          PesoCompra: datos.purchaseWeight,
        }
        const docRef = await addDoc(this.ganadoCol, ganado);
        let mensaje = `Toro agregado exitosamente, toro número ${datos.toroId}.`;
        Swal.fire({
          title: "Éxito",
          text: mensaje,
          icon: "success"
        });
        console.log("Document written with ID: ", docRef.id);
        return true;
      } else {
        let mensaje = `Ya existe el Toro número ${result[0].NumeroToro}.`;
        Swal.fire({
          title: "Error al agregar Toro",
          text: mensaje,
          icon: "error"
        });
        return false;
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      return false;
    }
  }

  /**
   * Función para agregar historial ganado
   */
  async crearHistorial(datos: any): Promise<boolean> {
    try {
      const [año, mes, dia] = datos.date.split('-');
      let fecha = new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
      const historial: HistorialPeso = {
        IDFierroFinca: Number(this.getItem("IDFierro")) || Number(this.idFierro),
        IDToro: Number(this.getItem("IDToro") || Number(this.idToro)),
        FechaPeso: fecha,
        Peso: datos.weight,
        Observaciones: datos.observation
      }
      const docRef = await addDoc(this.historialCol, historial);
      let mensaje = `Registro de peso agregado exitosamente.`;
      Swal.fire({
        title: "Éxito",
        text: mensaje,
        icon: "success"
      });
      console.log("Document written with ID: ", docRef.id);
      return true;
    } catch (e) {
      console.error("Error adding document: ", e);
      return false;
    }
  }

  // Metodo para actualizar lista de fincas en tiempo real
  actualizarSnapshotFinca() {
    try {
      // Obtener datos en tiempo real
      onSnapshot(query(this.fincaCol, where("IDUsuario", "==", this.getItem("UID") || this.uid)), (snapshot) => {
        this.updatedSnapshot.next(snapshot);
      }, (err) => {
        console.log(err);
      });
    } catch (error) {
      console.log("Error: ", error)
    }
  }

  // Metodo para actualizar lista de ganado en tiempo real
  actualizarSnapshotGanado() {
    try {
      // Obtener datos en tiempo real
      onSnapshot(query(this.ganadoCol, where("IDFierroFinca", "==", Number(this.getItem('IDFierro') || this.idFierro))), (snapshot) => {
        this.updatedSnapshot.next(snapshot);
      }, (err) => {
        console.log(err);
      });
    } catch (error) {
      console.log("Error: ", error)
    }
  }

  // Metodo para actualizar lista de historial de toro en tiempo real
  actualizarSnapshotHistorial() {
    try {
      // Obtener datos en tiempo real
      onSnapshot(query(this.historialCol, where("IDFierroFinca", "==", Number(this.getItem('IDFierro') || this.idFierro)),
        where("IDToro", "==", Number(this.getItem('IDToro') || this.idToro))), (snapshot) => {
          this.updatedSnapshot.next(snapshot);
        }, (err) => {
          console.log(err);
        });
    } catch (error) {
      console.log("Error: ", error)
    }
  }

  // Función para obtener las fincas del usuario
  async obtenerFincasUsuario() {
    const snapshot = await getDocs(query(this.fincaCol, where("IDUsuario", "==", this.getItem("UID") || this.uid)));
    return snapshot;
  }

  // Función para obtener ganado de la finca seleccionada
  async obtenerGanadoFinca() {
    const snapshot = await getDocs(query(this.ganadoCol, where("IDFierroFinca", "==", Number(this.getItem('IDFierro') || this.idFierro))));
    return snapshot;
  }

  // Función para obtener historial del toro seleccionado
  async obtenerHistorialToro() {
    const snapshot = await getDocs(query(this.historialCol, where("IDFierroFinca", "==", Number(this.getItem('IDFierro') || this.idFierro)),
      where("IDToro", "==", Number(this.getItem('IDToro') || this.idToro))));
    return snapshot;
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
          let result = await this.buscarUsuario(userCredential.user.email);
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

        let result = await this.buscarUsuario(userCredential.user.email);
        // guardar en localstorage
        this.setItem("Usuario", JSON.stringify(result[0]));
        this.setItem("UID", userCredential.user.uid);
        this.uid = this.getItem("UID") || userCredential.user.uid;
        // registrar usuario en base de datos
        if (result.length < 1) {
          const usuario: Usuario = {
            Nombre: userCredential.user.displayName,
            Correo: userCredential.user.email,
          };
          await addDoc(this.usuarioCol, usuario);
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
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
        title: mensaje,
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        this.removeItem("FincaActual");
        this.removeItem("IDFierro");
        this.removeItem("IDToro");
        this.removeItem("UID");
        this.removeItem("Usuario");
        this.router.navigate(['/']);
      });
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
      console.log("Error: ", error);
    });
  }



  /**
   * Funcion para eliminar finca seleccionada
   */
  async eliminarFinca(NumeroFierro: any) {
    Swal.fire({
      title: "¿Está seguro que desea eliminar la Finca?",
      text: `Si la elimina se borraran todos los registros!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, eliminar!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const finca = await this.buscarFinca(NumeroFierro);
        console.log(finca);
        const snapshot = await deleteDoc(doc(this.db, 'Finca', `${finca}`));
        Swal.fire({
          title: "Eliminado!",
          text: "Finca eliminada exitosamente.",
          icon: "success"
        });
        return snapshot;
      }
    });
  }

  /**
   * Funcion para eliminar ganado seleccionado
   */
  async eliminarGanado(NumeroToro: number) {
    Swal.fire({
      title: "¿Está seguro que desea eliminar el Toro?",
      text: `Si lo elimina se borraran todos los registros!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, eliminar!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const ganado = await this.buscarGanado(NumeroToro);
        console.log(ganado);
        const snapshot = await deleteDoc(doc(this.db, 'Ganado', `${ganado}`));
        Swal.fire({
          title: "Eliminado!",
          text: "Toro eliminado exitosamente.",
          icon: "success"
        });
        return snapshot;
      }
    });
  }

  /**
   * Funcion para buscar usuario
   */
  async buscarUsuario(email: string) {
    let result: any[] = [];
    const snapshot = await getDocs(query(this.usuarioCol, where("Correo", "==", email)));
    snapshot.forEach((doc) => {
      result.push(doc.data());
    });
    return result;
  }

  /**
   * Funcion para buscar finca
   */
  async buscarFinca(NumeroFierro: any) {
    let result;
    const snapshot = await getDocs(query(this.fincaCol, where('NumeroFierro', '==', NumeroFierro)));
    snapshot.forEach((doc) => {
      result = doc.id;
    });
    return result;
  }

  /**
   * Funcion para buscar ganado
   */
  async buscarGanado(NumeroToro: any) {
    let result;
    const snapshot = await getDocs(query(this.ganadoCol, where('NumeroToro', '==', NumeroToro)));
    snapshot.forEach((doc) => {
      result = doc.id;
    });
    return result;
  }

  // Set a value in local storage
  setItem(key: string, value: any): void {
    localStorage.setItem(key, value);
  }

  // Get a value from local storage
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.log("Error:", error);
      return null;
    }
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
