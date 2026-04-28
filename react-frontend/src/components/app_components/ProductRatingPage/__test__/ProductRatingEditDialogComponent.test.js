import React from "react";
import { render, screen } from "@testing-library/react";

import ProductRatingEditDialogComponent from "../ProductRatingEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders productRating edit dialog", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ProductRatingEditDialogComponent show={true} />
      </MemoryRouter>
    </Provider>,
  );
  expect(
    screen.getByRole("productRating-edit-dialog-component"),
  ).toBeInTheDocument();
});
