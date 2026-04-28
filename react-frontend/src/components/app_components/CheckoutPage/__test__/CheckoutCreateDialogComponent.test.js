import React from "react";
import { render, screen } from "@testing-library/react";

import CheckoutCreateDialogComponent from "../CheckoutCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders checkout create dialog", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CheckoutCreateDialogComponent show={true} />
      </MemoryRouter>
    </Provider>,
  );
  expect(
    screen.getByRole("checkout-create-dialog-component"),
  ).toBeInTheDocument();
});
