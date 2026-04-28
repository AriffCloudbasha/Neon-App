import React from "react";
import { render, screen } from "@testing-library/react";

import CustomerDetailsCreateDialogComponent from "../CustomerDetailsCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders customerDetails create dialog", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CustomerDetailsCreateDialogComponent show={true} />
      </MemoryRouter>
    </Provider>,
  );
  expect(
    screen.getByRole("customerDetails-create-dialog-component"),
  ).toBeInTheDocument();
});
