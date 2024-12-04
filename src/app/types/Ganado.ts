import { HistorialPeso } from "./HistorialPeso"

export type Ganado = {
    IDFierroFinca: number;
    FechaCompra: Date,
    LugarCompra: string,
    NumeroLote: number,
    NumeroToro: number,
    PesoCompra: number,
    Historial?: HistorialPeso[],
}