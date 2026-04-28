import React from "react";
import { render, screen } from "@testing-library/react";

import CustomerDetailsEditDialogComponent from "../CustomerDetailsEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders customerDetails edit dialog", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CustomerDetailsEditDialogComponent show={true} />
      </MemoryRouter>
    </Provider>,
  );
  expect(
    screen.getByRole("customerDetails-edit-dialog-component"),
  ).toBeInTheDocument();
});
