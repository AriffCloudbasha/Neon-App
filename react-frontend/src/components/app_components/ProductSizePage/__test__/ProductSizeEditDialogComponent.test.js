import React from "react";
import { render, screen } from "@testing-library/react";

import ProductSizeEditDialogComponent from "../ProductSizeEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders productSize edit dialog", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ProductSizeEditDialogComponent show={true} />
      </MemoryRouter>
    </Provider>,
  );
  expect(
    screen.getByRole("productSize-edit-dialog-component"),
  ).toBeInTheDocument();
});
