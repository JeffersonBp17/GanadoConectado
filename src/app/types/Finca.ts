import { Ganado } from "./Ganado"

export type Finca = {
    Nombre: string,
    TipoGanado: string,
    IDUsuario: string,
    NumeroFierro: number,
    Ganado?: Ganado [],
}