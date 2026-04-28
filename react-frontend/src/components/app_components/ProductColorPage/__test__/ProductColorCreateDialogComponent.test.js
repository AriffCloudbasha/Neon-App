import React from "react";
import { render, screen } from "@testing-library/react";

import ProductColorCreateDialogComponent from "../ProductColorCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders productColor create dialog", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ProductColorCreateDialogComponent show={true} />
      </MemoryRouter>
    </Provider>,
  );
  expect(
    screen.getByRole("productColor-create-dialog-component"),
  ).toBeInTheDocument();
});
