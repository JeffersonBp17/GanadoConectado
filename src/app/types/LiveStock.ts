import { WeightRecord } from "./WeightRecord";

export interface Livestock {
    toroId: string;
    purchaseDate: string;
    purchaseWeight: number;
    purchaseLocation: string;
    arrivalWeight: number;
    batchNumber: string;
    weightRecords: WeightRecord[]; // Historial de peso y observaciones
}



