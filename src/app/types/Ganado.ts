import { HistorialPeso } from "./HistorialPeso"

export type Ganado = {
    FechaCompra: Date,
    LugarCompra: string,
    NumeroLote: number,
    NumeroToro: number,
    PesoCompra: number,
    Historial?: HistorialPeso[],
}