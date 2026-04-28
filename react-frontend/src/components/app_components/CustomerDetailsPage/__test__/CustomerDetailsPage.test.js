import React from "react";
import { render, screen } from "@testing-library/react";

import CustomerDetailsPage from "../CustomerDetailsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders customerDetails page", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CustomerDetailsPage />
      </MemoryRouter>
    </Provider>,
  );
  expect(screen.getByRole("customerDetails-datatable")).toBeInTheDocument();
  expect(screen.getByRole("customerDetails-add-button")).toBeInTheDocument();
});
