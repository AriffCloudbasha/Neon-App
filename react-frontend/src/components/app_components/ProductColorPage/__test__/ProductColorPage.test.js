import React from "react";
import { render, screen } from "@testing-library/react";

import ProductColorPage from "../ProductColorPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders productColor page", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ProductColorPage />
      </MemoryRouter>
    </Provider>,
  );
  expect(screen.getByRole("productColor-datatable")).toBeInTheDocument();
  expect(screen.getByRole("productColor-add-button")).toBeInTheDocument();
});
