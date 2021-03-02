import React from "react";
import { BrowserRouter as Router, MemoryRouter, Route } from "react-router-dom";
import { render, fireEvent, waitFor, act } from "@testing-library/react";
import ApolloMockedProvider from "./utils/provider";

import MyRecipe from "../routes/myRecipe";

const jestMock = jest.fn();

describe("Landing", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Accessability", () => {
    test("Snapshot", async () => {
      const { asFragment } = render(
        <ApolloMockedProvider>
          <Router>
            <MyRecipe jestMock={jestMock} />
          </Router>
        </ApolloMockedProvider>
      );

      await waitFor(() => expect(asFragment()).toMatchSnapshot());
    });
    test("Mock", async () => {
      render(
        <ApolloMockedProvider showErrors={false}>
          <Router>
            <MyRecipe jestMock={jestMock} />
          </Router>
        </ApolloMockedProvider>
      );

      expect(jestMock).toHaveBeenCalled();
      await waitFor(() =>
        expect(jestMock).toHaveBeenLastCalledWith("myRecipe rendered!")
      );
    });
  });
});
