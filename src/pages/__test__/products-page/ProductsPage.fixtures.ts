import { MockWebServer } from "../../../tests/MockWebServer";
import productsResponse from "./data/ProductsPage.json";

export function givenAProducts(mockWebServer: MockWebServer) {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `https://fakestoreapi.com/products`,
            httpStatusCode: 200,
            response: productsResponse,
        },
    ]);

    return productsResponse;
}

export function givenThereAreNoProducts(mockWebServer: MockWebServer) {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `https://fakestoreapi.com/products`,
            httpStatusCode: 200,
            response: [],
        },
    ]);
}
