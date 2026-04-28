import React from "react";
import { render, screen } from "@testing-library/react";

import OrderHistoryPage from "../OrderHistoryPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders orderHistory page", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <OrderHistoryPage />
      </MemoryRouter>
    </Provider>,
  );
  expect(screen.getByRole("orderHistory-datatable")).toBeInTheDocument();
  expect(screen.getByRole("orderHistory-add-button")).toBeInTheDocument();
});
