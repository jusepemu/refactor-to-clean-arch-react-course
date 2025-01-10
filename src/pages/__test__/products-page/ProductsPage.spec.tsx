import { render, screen, waitFor, within } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { AppProvider } from "../../../context/AppProvider";
import { ProductsPage } from "../../ProductsPage";
import { MockWebServer } from "../../../tests/MockWebServer";
import { givenAProducts, givenThereAreNoProducts } from "./ProductsPage.fixtures";
import {
    getEditPriceDialogByRowIndex,
    verifyProductsRowsIsEqualToResponse,
    verifyProductTableHeaders,
} from "./ProductsPage.helpers";

const mockWebServer = new MockWebServer();

const renderComponent = () => (
    <AppProvider>
        <ProductsPage />
    </AppProvider>
);

describe("Products page", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    test("loads and display the title", async () => {
        givenAProducts(mockWebServer);

        render(renderComponent());

        await screen.findByRole("heading", { name: "Product price updater" });
    });

    test("loads and display table", () => {
        givenAProducts(mockWebServer);

        render(renderComponent());

        screen.getAllByRole("columnheader");
    });

    describe("Given a table", () => {
        test("Should show an empty table if there are no data", async () => {
            givenThereAreNoProducts(mockWebServer);

            render(renderComponent());

            const rows = await screen.findAllByRole("row");

            expect(rows.length).toBe(1);

            verifyProductTableHeaders(rows[0]);
        });

        test("should show products in a table if there are data'", async () => {
            const productsResponse = givenAProducts(mockWebServer);

            render(renderComponent());

            await waitFor(async () => {
                const rows = await screen.findAllByRole("row");
                expect(rows.length).toBeGreaterThan(1);
            });

            const rows = await screen.findAllByRole("row");

            const [header, ...productRows] = rows;

            verifyProductTableHeaders(header);

            verifyProductsRowsIsEqualToResponse(productRows, productsResponse);
        });
    });

    describe("Update price", () => {
        test("should show a modal when user click on update price option", async () => {
            const products = givenAProducts(mockWebServer);

            render(renderComponent());

            await waitFor(async () => {
                const rows = await screen.findAllByRole("row");
                expect(rows.length).toBeGreaterThan(1);
            });

            const dialog = await getEditPriceDialogByRowIndex(0);

            const product = products[0];
            const dialogScope = within(dialog);

            dialogScope.getByText(product.title);
            screen.getByDisplayValue(product.price);
        });
    });
});
