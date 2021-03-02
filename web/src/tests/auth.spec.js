import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, waitFor } from "@testing-library/react";
import ApolloMockedProvider from "./utils/provider";

import { Login, SignUp } from "../routes/auth";

const jestMock = jest.fn();

describe("Login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Accessability", () => {
    test("Snapshot", async () => {
      const { asFragment } = render(
        <ApolloMockedProvider>
          <Router>
            <Login jestMock={jestMock} />
          </Router>
        </ApolloMockedProvider>
      );

      await waitFor(() => expect(asFragment()).toMatchSnapshot());
    });
    test("Mock", async () => {
      render(
        <ApolloMockedProvider showErrors={false}>
          <Router>
            <Login jestMock={jestMock} />
          </Router>
        </ApolloMockedProvider>
      );

      expect(jestMock).toHaveBeenCalled();
      await waitFor(() =>
        expect(jestMock).toHaveBeenLastCalledWith("login rendered!")
      );
    });
  });
});

describe("Sign Up", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Accessability", () => {
    test("Snapshot", async () => {
      const { asFragment } = render(
        <ApolloMockedProvider>
          <Router>
            <SignUp jestMock={jestMock} />
          </Router>
        </ApolloMockedProvider>
      );

      await waitFor(() => expect(asFragment()).toMatchSnapshot());
    });
    test("Mock", async () => {
      render(
        <ApolloMockedProvider showErrors={false}>
          <Router>
            <SignUp jestMock={jestMock} />
          </Router>
        </ApolloMockedProvider>
      );

      expect(jestMock).toHaveBeenCalled();
      await waitFor(() =>
        expect(jestMock).toHaveBeenLastCalledWith("signUp rendered!")
      );
    });
  });
});
