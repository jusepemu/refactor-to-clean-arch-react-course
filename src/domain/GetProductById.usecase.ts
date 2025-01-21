import { Product } from "./Product";
import { ProductRepository } from "./Product.repository";

export class ResourceNotFound extends Error {}

export class GetProductById {
    constructor(private readonly productRepository: ProductRepository) {}

    async execute(id: number): Promise<Product> {
        try {
            return await this.productRepository.getById(id);
        } catch (error: unknown) {
            throw new ResourceNotFound(`Product with id ${id} not found`);
        }
    }
}
