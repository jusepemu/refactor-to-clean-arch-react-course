import { render, screen, within } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { AppProvider } from "../../../context/AppProvider";
import { ProductsPage } from "../../ProductsPage";
import { MockWebServer } from "../../../tests/MockWebServer";
import { givenAProducts, givenThereAreNoProducts } from "./ProductsPage.fixtures";
import {
    awaitToRenderTable,
    getEditPriceDialogByRowIndex,
    savePrice,
    typePrice,
    verifyError,
    verifyPriceAndStatus,
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

            await awaitToRenderTable();

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

            await awaitToRenderTable();

            const dialog = await getEditPriceDialogByRowIndex(0);

            const product = products[0];

            const dialogScope = within(dialog);

            dialogScope.getByText(product.title);
            screen.getByDisplayValue(product.price);
        });

        test("should show a error when price is lower than zero", async () => {
            givenAProducts(mockWebServer);

            render(renderComponent());

            await awaitToRenderTable();

            const dialog = await getEditPriceDialogByRowIndex(0);

            await typePrice(dialog, "-3");

            await verifyError(dialog, "Invalid price format");
        });

        test("should show a error when price is string", async () => {
            givenAProducts(mockWebServer);

            render(renderComponent());

            await awaitToRenderTable();

            const dialog = await getEditPriceDialogByRowIndex(0);

            await typePrice(dialog, "aaaa");

            await verifyError(dialog, "Only numbers are allowed");
        });

        test("should show a error when price is upper to 999.99", async () => {
            givenAProducts(mockWebServer);

            render(renderComponent());

            await awaitToRenderTable();

            const dialog = await getEditPriceDialogByRowIndex(0);

            await typePrice(dialog, "1000");

            await verifyError(dialog, "The max possible price is 999.99");
        });

        test("should update the price correctly ans mark with status active if price is grant to 0", async () => {
            givenAProducts(mockWebServer);
            render(renderComponent());
            await awaitToRenderTable();

            const price = "120.99";
            const dialog = await getEditPriceDialogByRowIndex(0);
            await typePrice(dialog, price);
            await savePrice(dialog);

            await verifyPriceAndStatus(0, price);
        });

        test("should update the price correctly ans mark with status inactive if price is equal to 0", async () => {
            givenAProducts(mockWebServer);
            render(renderComponent());
            await awaitToRenderTable();

            const price = "0";
            const dialog = await getEditPriceDialogByRowIndex(0);
            await typePrice(dialog, price);
            await savePrice(dialog);

            await verifyPriceAndStatus(0, price);
        });
    });
});
