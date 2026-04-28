import React from "react";
import { render, screen } from "@testing-library/react";

import OrderProductPage from "../OrderProductPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders orderProduct page", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <OrderProductPage />
      </MemoryRouter>
    </Provider>,
  );
  expect(screen.getByRole("orderProduct-datatable")).toBeInTheDocument();
  expect(screen.getByRole("orderProduct-add-button")).toBeInTheDocument();
});
