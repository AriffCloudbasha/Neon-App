import React from "react";
import { render, screen } from "@testing-library/react";

import UserDetailsEditDialogComponent from "../UserDetailsEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders userDetails edit dialog", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <UserDetailsEditDialogComponent show={true} />
      </MemoryRouter>
    </Provider>,
  );
  expect(
    screen.getByRole("userDetails-edit-dialog-component"),
  ).toBeInTheDocument();
});
