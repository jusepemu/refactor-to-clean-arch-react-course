import { RemoteProduct, StoreApi } from "../data/api/StoreApi";
import { Product } from "./Product";

export function buildProduct(remoteProduct: RemoteProduct): Product {
    return {
        id: remoteProduct.id,
        title: remoteProduct.title,
        image: remoteProduct.image,
        price: remoteProduct.price.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        }),
    };
}

export class GetProducts {
    constructor(private readonly storeApi: StoreApi) {}

    async execute(): Promise<Product[]> {
        const remoteProducts: RemoteProduct[] = await this.storeApi.getAll();
        const products = remoteProducts.map(buildProduct);

        return products;
    }
}
