import { Product } from "./Product";

export interface ProductRepository {
    getAll: () => Promise<Product[]>;
    getById: (productId: number) => Promise<Product>;
    save: (productId: number, price: number) => Promise<void>;
}
