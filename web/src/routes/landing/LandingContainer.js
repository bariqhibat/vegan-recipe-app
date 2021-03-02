import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_ALL_RECIPES } from "../../graphql/Recipes";

import LandingContext from "./LandingContext";

const Container = ({ history, ...props }) => {
  let loading = true;
  let error = null;

  const { children } = props;

  const {
    data: { getAllRecipes: { recipes } = {} } = {},
    loading: getAllRecipesLoading,
    error: getAllRecipesError,
  } = useQuery(GET_ALL_RECIPES);

  try {
    loading = getAllRecipesLoading;

    // Error view
    error = getAllRecipesError;

    if (error) {
      throw error;
    }

    return (
      <LandingContext.Provider
        value={{
          skeletonLoading: getAllRecipesLoading,
          history,
          loading,
          recipes,
        }}
      >
        {children}
      </LandingContext.Provider>
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
