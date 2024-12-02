import { Ganado } from "./Ganado"

export type Finca = {
    Nombre: string,
    TipoGanado: string,
    NumeroFierro: number,
    Ganado?: Ganado [],
}