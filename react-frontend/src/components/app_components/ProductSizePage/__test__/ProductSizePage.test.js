import React from "react";
import { render, screen } from "@testing-library/react";

import ProductSizePage from "../ProductSizePage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders productSize page", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ProductSizePage />
      </MemoryRouter>
    </Provider>,
  );
  expect(screen.getByRole("productSize-datatable")).toBeInTheDocument();
  expect(screen.getByRole("productSize-add-button")).toBeInTheDocument();
});
