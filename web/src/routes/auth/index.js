import React from "react";
import { Card } from "antd";

import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignupForm";

import AuthContainer from "./AuthContainer";

export const Login = ({ setLoggedIn, jestMock }) => {
  if (jestMock) jestMock("login rendered!");
  return (
    <AuthContainer setLoggedIn={setLoggedIn}>
      <div
        style={{
          paddingTop: "2rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card
          style={{
            width: "85%",
            maxWidth: "500px",
            height: "fit-content",
            padding: "2rem",
            border: "1px solid white",
          }}
        >
          <LoginForm setLoggedIn={setLoggedIn} />
        </Card>
      </div>
    </AuthContainer>
  );
};

export const SignUp = ({ setLoggedIn, jestMock }) => {
  if (jestMock) jestMock("signUp rendered!");
  return (
    <AuthContainer setLoggedIn={setLoggedIn}>
      <div
        style={{
          paddingTop: "2rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card
          style={{
            width: "85%",
            maxWidth: "500px",
            height: "fit-content",
            padding: "2rem",
            border: "1px solid white",
          }}
        >
          <SignUpForm />
        </Card>
      </div>
    </AuthContainer>
  );
};
