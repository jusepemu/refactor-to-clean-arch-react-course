import { StoreApi } from "../data/api/StoreApi";
import { User } from "../presentation/context/AppContext";
import { ProductRepository } from "./Product.repository";

export class UpdateProductPrice {
    constructor(readonly productRepository: ProductRepository, readonly storeApi: StoreApi) {}

    async execute(user: User, productId: number, price: string) {
        if (!user.isAdmin) throw new Error("Action not allowed to the user");

        const remoteProduct = await this.storeApi.get(productId);

        if (!remoteProduct) return;

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
