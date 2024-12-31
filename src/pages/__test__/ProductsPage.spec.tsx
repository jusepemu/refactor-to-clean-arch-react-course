import { render, screen } from "@testing-library/react";
import { test } from "vitest";
import App from "../../App";

test("loads and display the title", async () => {
    render(<App />);

    await screen.findByRole("heading", { name: "Product price updater" });
});
