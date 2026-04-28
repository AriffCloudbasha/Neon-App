import React from "react";
import { render, screen } from "@testing-library/react";

import OrderHistoryEditDialogComponent from "../OrderHistoryEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders orderHistory edit dialog", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <OrderHistoryEditDialogComponent show={true} />
      </MemoryRouter>
    </Provider>,
  );
  expect(
    screen.getByRole("orderHistory-edit-dialog-component"),
  ).toBeInTheDocument();
});
