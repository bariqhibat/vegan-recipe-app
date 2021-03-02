import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_RECIPES_BY_USER_ID,
  DELETE_RECIPE_BY_ID,
  GET_ALL_RECIPES,
} from "../../graphql/Recipes";
import { ME_QUERY } from "../../graphql/Users";

import MyRecipeContext from "./MyRecipeContext";

const Container = ({ history, ...props }) => {
  let loading = true;
  let error = null;

  const { children } = props;

  const {
    data: { meQuery: { user: me } = {} } = {},
    loading: meQueryLoading,
    error: meQueryError,
  } = useQuery(ME_QUERY, {
    fetchPolicy: "network-only",
  });

  const {
    data: { getRecipeByUserUUID: { recipes } = {} } = {},
    loading: getRecipeByUserUUIDLoading,
    error: getRecipeByUserUUIDError,
  } = useQuery(GET_RECIPES_BY_USER_ID, {
    skip: !me,
    variables: {
      userUUID: me?._id,
    },
    fetchPolicy: "cache-and-network",
  });

  const [
    deleteRecipeById,
    { loading: deleteRecipeByIdLoading, error: deleteRecipeByIdError },
  ] = useMutation(DELETE_RECIPE_BY_ID, {
    update: (
      store,
      {
        data: {
          deleteRecipeById: { ok, recipe },
        },
      }
    ) => {
      try {
        if (ok && recipe) {
          let data = store.readQuery({
            query: GET_ALL_RECIPES,
          });

          store.writeQuery({
            query: GET_ALL_RECIPES,
            data: {
              ...data,
              getAllRecipes: {
                ...data.getAllRecipes,
                recipes: data.getAllRecipes.recipes.filter(
                  (e) => e._id.toString() !== recipe._id.toString()
                ),
              },
            },
          });

          if (Object.prototype.hasOwnProperty.call(recipe, "userUUID")) {
            data = store.readQuery({
              query: GET_RECIPES_BY_USER_ID,
              variables: {
                userUUID: me?._id,
              },
            });

            store.writeQuery({
              query: GET_RECIPES_BY_USER_ID,
              variables: {
                userUUID: me?._id,
              },
              data: {
                ...data,
                getRecipeByUserUUID: {
                  ...data.getRecipeByUserUUID,
                  recipes: data.getRecipeByUserUUID.recipes.filter(
                    (e) => e._id.toString() !== recipe._id.toString()
                  ),
                },
              },
            });
          }
        }
        return null;
      } catch (err) {
        console.log({ err });

        return null;
      }
    },
  });

  try {
    loading =
      getRecipeByUserUUIDLoading || deleteRecipeByIdLoading || meQueryLoading;

    // Error view
    error = getRecipeByUserUUIDError || meQueryError || deleteRecipeByIdError;

    if (error) {
      throw error;
    }

    return (
      <MyRecipeContext.Provider
        value={{
          skeletonLoading: getRecipeByUserUUIDLoading || meQueryLoading,
          me,
          history,
          loading,
          // Hooks
          deleteRecipeById,
          // Data from server
          recipes,
          // Mutation
        }}
      >
        {children}
      </MyRecipeContext.Provider>
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
