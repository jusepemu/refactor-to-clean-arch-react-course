import { RemoteProduct, StoreApi } from "../data/api/StoreApi";
import { buildProduct } from "../data/ProductApi.repository";
import { Product } from "./Product";

export class ResourceNotFound extends Error {}

export class GetProductById {
    constructor(private readonly storeApi: StoreApi) {}

    async execute(id: number): Promise<Product> {
        try {
            const remoteProduct: RemoteProduct = await this.storeApi.get(id);
            return buildProduct(remoteProduct);
        } catch (error: unknown) {
            throw new ResourceNotFound(`Product with id ${id} not found`);
        }
    }
}
