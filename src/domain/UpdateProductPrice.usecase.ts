import { User } from "../presentation/context/AppContext";
import { ProductRepository } from "./Product.repository";

export class UpdateProductPrice {
    constructor(readonly productRepository: ProductRepository) {}

    async execute(user: User, productId: number, price: string) {
        if (!user.isAdmin) throw new Error("Action not allowed to the user");

        return await this.productRepository.save(productId, Number(price));
    }
}
