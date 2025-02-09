import { ValueObject } from "./core/ValueObject";

const priceRegex = /^\d+(\.\d{1,2})?$/;
const MAX_VALUE = 999.99;

export class Price extends ValueObject<{ value: number }> {
    readonly value: number = 0;
    private constructor(props: Readonly<{ value: number }>) {
        super(props);
        this.value = props.value;
    }

    static create(price: string): Price {
        if (isNaN(+price)) throw new Error("Only numbers are allowed");
        if (!priceRegex.test(price)) throw new Error("Invalid price format");
        if (+price > MAX_VALUE) throw new Error("The max possible price is 999.99");

        return new Price({ value: +price });
    }
}
