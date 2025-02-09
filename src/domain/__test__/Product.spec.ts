import { describe, expect, test } from "vitest";
import { Product } from "../Product";

describe("Product", () => {
    test("should create Price with status active if price is greater than 0", () => {
        const product = Product.create({ id: 1, title: "title", image: "image", price: "2.4" });

        expect(product.status).toBe("active");
    });

    test("should create Price with status inactive if price is 0", () => {
        const product = Product.create({ id: 1, title: "title", image: "image", price: "0" });

        expect(product.status).toBe("inactive");
    });
});
