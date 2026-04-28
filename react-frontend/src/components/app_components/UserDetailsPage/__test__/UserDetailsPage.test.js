import React from "react";
import { render, screen } from "@testing-library/react";

import UserDetailsPage from "../UserDetailsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders userDetails page", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <UserDetailsPage />
      </MemoryRouter>
    </Provider>,
  );
  expect(screen.getByRole("userDetails-datatable")).toBeInTheDocument();
  expect(screen.getByRole("userDetails-add-button")).toBeInTheDocument();
});
