import { Product } from "../domain/Product";
import { ProductRepository } from "../domain/Product.repository";
import { RemoteProduct, StoreApi } from "./api/StoreApi";

function buildProduct(remoteProduct: RemoteProduct): Product {
    return Product.create({
        id: remoteProduct.id,
        title: remoteProduct.title,
        image: remoteProduct.image,
        price: remoteProduct.price.toString(),
    });
}

export class ProductApiRepository implements ProductRepository {
    constructor(private readonly storeApi: StoreApi) {}

    async getAll(): Promise<Product[]> {
        const remoteProducts: RemoteProduct[] = await this.storeApi.getAll();
        const products = remoteProducts.map(buildProduct);

        return products;
    }

    async getById(productId: number): Promise<Product> {
        const remoteProduct: RemoteProduct = await this.storeApi.get(productId);
        return buildProduct(remoteProduct);
    }
}
