import { within } from "@testing-library/dom";
import { expect } from "vitest";

export function verifyProductTableHeaders(rowHeader: HTMLElement) {
    const headerRowScope = within(rowHeader);
    const cells = headerRowScope.getAllByRole("columnheader");
    expect(cells.length).toBe(6);

    const columns = ["id", "price", "image", "price", "status"];

    for (const column of columns) {
        headerRowScope.getByRole("columnheader", { name: new RegExp(column, "i") });
    }
}
