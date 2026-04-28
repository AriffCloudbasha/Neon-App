import React from "react";
import { render, screen } from "@testing-library/react";

import ProductRatingPage from "../ProductRatingPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders productRating page", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ProductRatingPage />
      </MemoryRouter>
    </Provider>,
  );
  expect(screen.getByRole("productRating-datatable")).toBeInTheDocument();
  expect(screen.getByRole("productRating-add-button")).toBeInTheDocument();
});
