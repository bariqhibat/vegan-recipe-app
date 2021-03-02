import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import { useMutation, useLazyQuery } from "@apollo/client";
import { EMAIL_SIGNUP, EMAIL_LOGIN, ME_QUERY } from "../../graphql/Users";

import AuthContext from "./AuthContext";

const Container = ({ history, setLoggedIn, ...props }) => {
  let loading = true;
  let error = null;

  const { children } = props;

  // Get params from routes
  // eslint-disable-next-line

  // Run queries

  // GQL mutations
  const [
    createUser,
    { loading: createUserLoading, error: createUserError },
  ] = useMutation(EMAIL_SIGNUP);

  const [login, { loading: loginLoading, error: loginError }] = useMutation(
    EMAIL_LOGIN
  );

  const [
    fetchMe,
    {
      // data: { meQuery: { user } = {} } = {},
      loading: meQueryLoading,
      error: meQueryError,
    },
  ] = useLazyQuery(ME_QUERY);

  try {
    loading = createUserLoading || loginLoading || meQueryLoading;

    // Error view
    error = createUserError || loginError || meQueryError;

    if (error) {
      throw error;
    }

    return (
      <AuthContext.Provider
        value={{
          setLoggedIn,
          history,
          loading,
          // Hooks
          // Data from server
          fetchMe,
          // Mutation
          createUser,
          login,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
    // eslint-disable-next-line
  } catch (error) {
    return (
      <Redirect
        to={{
          pathname: "/500",
          state: { error },
        }}
      />
    );
  }
};

export default withRouter(Container);
