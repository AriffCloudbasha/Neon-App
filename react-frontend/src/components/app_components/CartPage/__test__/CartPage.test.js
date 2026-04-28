import React from "react";
import { render, screen } from "@testing-library/react";

import CartPage from "../CartPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders cart page", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    </Provider>,
  );
  expect(screen.getByRole("cart-datatable")).toBeInTheDocument();
  expect(screen.getByRole("cart-add-button")).toBeInTheDocument();
});
