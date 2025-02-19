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

    async save(productId: number, price: number) {
        const remoteProduct = await this.storeApi.get(productId);

        if (!remoteProduct) throw new Error("Product not found");

        const editedRemoteProduct = {
            ...remoteProduct,
            price: Number(price),
        };

        try {
            await this.storeApi.post(editedRemoteProduct);
        } catch (error) {
            throw new Error(
                `An error has occurred updating the price ${editedRemoteProduct.price} for '${editedRemoteProduct.title}'`
            );
        }
    }
}
