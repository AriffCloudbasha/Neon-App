import React from "react";
import { render, screen } from "@testing-library/react";

import ProductSizeCreateDialogComponent from "../ProductSizeCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders productSize create dialog", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ProductSizeCreateDialogComponent show={true} />
      </MemoryRouter>
    </Provider>,
  );
  expect(
    screen.getByRole("productSize-create-dialog-component"),
  ).toBeInTheDocument();
});
