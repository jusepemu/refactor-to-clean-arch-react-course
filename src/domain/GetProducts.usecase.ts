import { Product } from "./Product";
import { ProductRepository } from "./Product.repository";

export class GetProducts {
    constructor(private readonly productRepository: ProductRepository) {}

    async execute(): Promise<Product[]> {
        return this.productRepository.getAll();
    }
}
