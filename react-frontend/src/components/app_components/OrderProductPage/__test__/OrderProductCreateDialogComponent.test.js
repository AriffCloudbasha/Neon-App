import React from "react";
import { render, screen } from "@testing-library/react";

import OrderProductCreateDialogComponent from "../OrderProductCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders orderProduct create dialog", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <OrderProductCreateDialogComponent show={true} />
      </MemoryRouter>
    </Provider>,
  );
  expect(
    screen.getByRole("orderProduct-create-dialog-component"),
  ).toBeInTheDocument();
});
