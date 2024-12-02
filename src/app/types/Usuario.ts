import { Finca } from "./Finca"

export type Usuario = {
    Nombre: string,
    Correo: string,
    Contrasena: string
    Finca?: Finca [],
}