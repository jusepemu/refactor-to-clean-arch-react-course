import { screen, waitFor, within } from "@testing-library/dom";
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

export async function awaitToRenderTable() {
    await waitFor(async () => {
        const rows = await screen.findAllByRole("row");
        expect(rows.length).toBeGreaterThan(1);
    });
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

export async function typePrice(dialog: HTMLElement, price: string) {
    expect(dialog).toBeTruthy();
    const user = userEvent.setup();

    const dialogScope = within(dialog);

    const priceTextBox = dialogScope.getByRole("textbox", { name: /price/i });

    await user.clear(priceTextBox);
    await user.type(priceTextBox, price);
}

export async function verifyError(dialog: HTMLElement, error: string) {
    expect(dialog).toBeTruthy();
    const dialogScope = within(dialog);

    await dialogScope.findByText(new RegExp(error, "i"));
}
