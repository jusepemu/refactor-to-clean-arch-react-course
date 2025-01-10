import { screen, within } from "@testing-library/dom";
import { expect } from "vitest";
import { RemoteProduct } from "../../../api/StoreApi";
import userEvent from "@testing-library/user-event";

export function verifyProductTableHeaders(rowHeader: HTMLElement) {
    const headerRowScope = within(rowHeader);
    const cells = headerRowScope.getAllByRole("columnheader");
    expect(cells.length).toBe(6);

    const columns = ["id", "price", "image", "price", "status"];

    for (const column of columns) {
        headerRowScope.getByRole("columnheader", { name: new RegExp(column, "i") });
    }
}

export function verifyProductsRowsIsEqualToResponse(
    rows: HTMLElement[],
    products: RemoteProduct[]
) {
    expect(rows.length).toBe(products.length);

    rows.forEach((row, index) => {
        const rowScope = within(row);
        const product = products[index];

        const status = product.price === 0 ? "inactive" : "active";

        rowScope.getByRole("cell", { name: new RegExp(product.title, "i") });
        rowScope.getByRole("cell", { name: new RegExp(String(product.price), "i") });
        rowScope.getByRole("cell", { name: new RegExp(status, "i") });
    });
}

export async function getEditPriceDialogByRowIndex(rowIndex: number) {
    const user = userEvent.setup();

    const rows = await screen.findAllByRole("row");

    const [, ...productsRows] = rows;

    const productRow = within(productsRows[rowIndex]);
    const actions = productRow.getByRole("menuitem", { name: /more/i });

    await user.click(actions);

    const updatePriceButton = await screen.findByRole("menuitem", {
        name: /update price/i,
    });

    await user.click(updatePriceButton);

    return await screen.findByRole("dialog", {
        name: /update price/i,
    });
}
