import React from "react";
import { render, screen } from "@testing-library/react";

import ProductPricePage from "../ProductPricePage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders productPrice page", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ProductPricePage />
      </MemoryRouter>
    </Provider>,
  );
  expect(screen.getByRole("productPrice-datatable")).toBeInTheDocument();
  expect(screen.getByRole("productPrice-add-button")).toBeInTheDocument();
});
