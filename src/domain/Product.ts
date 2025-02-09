import { Price } from "./Price";

export interface ProductData {
    id: number;
    title: string;
    image: string;
    price: string;
}

export type ProductStatus = "active" | "inactive";

type ProductEntityData = Omit<ProductData, "price"> & {
    price: Price;
    status: ProductStatus;
};

export class Product {
    readonly id: number;
    readonly title: string;
    readonly image: string;
    readonly price: Price;
    readonly status: ProductStatus;

    private constructor(data: ProductEntityData) {
        this.id = data.id;
        this.title = data.title;
        this.image = data.image;
        this.price = data.price;
        this.status = data.status;
    }

    static create(data: ProductData): Product {
        const price = Price.create(data.price);
        const status = +data.price === 0 ? "inactive" : "active";

        return new Product({ ...data, price, status });
    }
}
