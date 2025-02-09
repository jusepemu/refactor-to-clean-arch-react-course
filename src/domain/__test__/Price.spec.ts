import { describe, expect, test } from "vitest";
import { Price } from "../Price";

describe("Price", () => {
    test("should create Price if all validations are ok", async () => {
        const price = Price.create("2.4");

        expect(price).toBeTruthy();
    });

    test("should throw error for negative prices", async () => {
        expect(() => Price.create("-2.4")).toThrowError("Invalid price format");
    });

    test("should throw error for non number prices", async () => {
        expect(() => Price.create("non_number")).toThrowError("Only numbers are allowed");
    });

    test("should throw error for prices greater than maximum", async () => {
        expect(() => Price.create("10000")).toThrowError("The max possible price is 999.99");
    });
});
