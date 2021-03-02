import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, waitFor } from "@testing-library/react";
import ApolloMockedProvider from "./utils/provider";

import NetworkError from "../routes/errorPages/networkError";
import NotFound from "../routes/errorPages/notFound";

const jestMock = jest.fn();

describe("404", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Accessability", () => {
    test("Snapshot", async () => {
      const { asFragment } = render(
        <ApolloMockedProvider>
          <Router>
            <NotFound jestMock={jestMock} />
          </Router>
        </ApolloMockedProvider>
      );

      await waitFor(() => expect(asFragment()).toMatchSnapshot());
    });
    test("Mock", async () => {
      render(
        <ApolloMockedProvider showErrors={false}>
          <Router>
            <NotFound jestMock={jestMock} />
          </Router>
        </ApolloMockedProvider>
      );

      expect(jestMock).toHaveBeenCalled();
      await waitFor(() =>
        expect(jestMock).toHaveBeenLastCalledWith("404 rendered!")
      );
    });
  });
});

describe("500", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Accessability", () => {
    test("Snapshot", async () => {
      const { asFragment } = render(
        <ApolloMockedProvider>
          <Router>
            <NetworkError jestMock={jestMock} />
          </Router>
        </ApolloMockedProvider>
      );

      await waitFor(() => expect(asFragment()).toMatchSnapshot());
    });
    test("Mock", async () => {
      render(
        <ApolloMockedProvider showErrors={false}>
          <Router>
            <NetworkError jestMock={jestMock} />
          </Router>
        </ApolloMockedProvider>
      );

      expect(jestMock).toHaveBeenCalled();
      await waitFor(() =>
        expect(jestMock).toHaveBeenLastCalledWith("500 rendered!")
      );
    });
  });
});
