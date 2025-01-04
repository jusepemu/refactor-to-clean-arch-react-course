import { render, screen } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, test } from "vitest";
import { AppProvider } from "../../context/AppProvider";
import { ProductsPage } from "../ProductsPage";
import { MockWebServer } from "../../tests/MockWebServer";
import productsResponse from "./data/ProductsPage.json";

const mockWebServer = new MockWebServer();

function givenAProducts() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `https://fakestoreapi.com/products`,
            httpStatusCode: 200,
            response: productsResponse,
        },
    ]);
}

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
        givenAProducts();

        render(renderComponent());

        await screen.findByRole("heading", { name: "Product price updater" });
    });
});
