import { WeightRecord } from "./WeightRecord";

export interface Livestock {
    toroId: string;
    purchaseDate: string;
    purchaseWeight: number;
    purchaseLocation: string;
    batchNumber: string;
    weightRecords: WeightRecord[]; // Historial de peso y observaciones
}



