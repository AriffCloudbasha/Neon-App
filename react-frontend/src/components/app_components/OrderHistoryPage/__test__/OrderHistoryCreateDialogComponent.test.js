import React from "react";
import { render, screen } from "@testing-library/react";

import OrderHistoryCreateDialogComponent from "../OrderHistoryCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders orderHistory create dialog", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <OrderHistoryCreateDialogComponent show={true} />
      </MemoryRouter>
    </Provider>,
  );
  expect(
    screen.getByRole("orderHistory-create-dialog-component"),
  ).toBeInTheDocument();
});
