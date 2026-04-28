import React from "react";
import { render, screen } from "@testing-library/react";

import CheckoutPage from "../CheckoutPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders checkout page", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    </Provider>,
  );
  expect(screen.getByRole("checkout-datatable")).toBeInTheDocument();
  expect(screen.getByRole("checkout-add-button")).toBeInTheDocument();
});
