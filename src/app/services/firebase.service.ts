import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { environment } from '../../environments/environment';
import { collection, getDocs, addDoc, getFirestore } from "firebase/firestore"; // conexion base de datos
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const app = initializeApp(environment.firebaseConfig);

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor() { }

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
      const docRef = await addDoc(collection(this.initializeDb(), "Usuario"), {
        nombre: datos.fullname,
        correo: datos.email,
        contra: datos.password,
        telefono: datos.phone
      });
      console.log("Document written with ID: ", docRef.id);

      // registro de usuario en autenticacion
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, datos.email, datos.password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log(user, userCredential);
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

      const docRef = await addDoc(collection(this.initializeDb(), "Ganado"), {
        fechaCompra: fecha,
        lugarCompra: datos.purchaseLocation,
        numLote: datos.batchNumber,
        numToro: datos.toroId,
        pesoCompra: datos.purchaseWeight,
        pesoFinca: datos.arrivalWeight
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
}
