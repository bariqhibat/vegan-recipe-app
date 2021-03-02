import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_RECIPE_BY_ID } from "../../graphql/Recipes";

import RecipeContext from "./RecipeContext";

const Container = ({ history, ...props }) => {
  let loading = true;
  let error = null;

  const { children, match } = props;
  const { params } = match;

  // eslint-disable-next-line
  const { recipeUUID } = params;

  const {
    data: { getRecipeById: { recipe } = {} } = {},
    loading: getRecipeByIdLoading,
    error: getRecipeByIdError,
  } = useQuery(GET_RECIPE_BY_ID, {
    variables: {
      recipeUUID,
    },
  });

  try {
    loading = getRecipeByIdLoading;

    // Error view
    error = getRecipeByIdError;

    if (error) {
      throw error;
    }

    return (
      <RecipeContext.Provider
        value={{
          history,
          loading,
          recipe,
        }}
      >
        {children}
      </RecipeContext.Provider>
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
