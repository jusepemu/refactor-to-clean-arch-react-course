import { render, screen } from "@testing-library/react";
import { test } from "vitest";
import { AppProvider } from "../../context/AppProvider";
import { ProductsPage } from "../ProductsPage";

const renderComponent = () => (<AppProvider><ProductsPage /></AppProvider>)

test("loads and display the title", async () => {
    render(renderComponent());

    await screen.findByRole("heading", { name: "Product price updater" });
});
