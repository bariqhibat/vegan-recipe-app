import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, waitFor } from "@testing-library/react";
import ApolloMockedProvider from "./utils/provider";

import AddRecipe from "../routes/addRecipe";

const jestMock = jest.fn();

describe("Add Recipe", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Accessability", () => {
    test("Snapshot", async () => {
      const { asFragment } = render(
        <ApolloMockedProvider>
          <Router>
            <AddRecipe jestMock={jestMock} />
          </Router>
        </ApolloMockedProvider>
      );

      await waitFor(() => expect(asFragment()).toMatchSnapshot());
    });
    test("Mock", async () => {
      render(
        <ApolloMockedProvider showErrors={false}>
          <Router>
            <AddRecipe jestMock={jestMock} />
          </Router>
        </ApolloMockedProvider>
      );

      expect(jestMock).toHaveBeenCalled();
      await waitFor(() =>
        expect(jestMock).toHaveBeenLastCalledWith("addRecipe rendered!")
      );
    });
  });
});
