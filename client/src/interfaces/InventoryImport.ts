import { ISupplier } from "./ISupplier";

export interface InventoryImport {
    id: number;
    import_price: number;
    quantity: number;
    supplier: ISupplier;
}