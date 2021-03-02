import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_RECIPE,
  GET_ALL_RECIPES,
  GET_RECIPES_BY_USER_ID,
  UPDATE_RECIPE_BY_ID,
  GET_RECIPE_BY_ID,
} from "../../graphql/Recipes";
import { ME_QUERY } from "../../graphql/Users";
import { UPLOAD_FILE } from "../../graphql/Files";

import AddRecipeContext from "./AddRecipeContext";

const Container = ({ history, ...props }) => {
  let loading = true;
  let error = null;

  const { children, match } = props;
  const { params } = match;

  // Get params from routes
  // eslint-disable-next-line
  const { recipeUUID } = params;

  // Run queries
  const {
    data: { meQuery: { user: me } = {} } = {},
    loading: meQueryLoading,
    error: meQueryError,
  } = useQuery(ME_QUERY, {
    fetchPolicy: "network-only",
  });

  const {
    data: { getRecipeById: { recipe: editedRecipe } = {} } = {},
    loading: getRecipeByIdLoading,
    error: getRecipeByIdError,
  } = useQuery(GET_RECIPE_BY_ID, {
    skip: !recipeUUID,
    variables: {
      recipeUUID,
    },
  });

  // GQL mutations
  const [uploadFile] = useMutation(UPLOAD_FILE);

  const [
    createRecipe,
    { loading: createRecipeLoading, error: createRecipeError },
  ] = useMutation(CREATE_RECIPE, {
    update: (
      store,
      {
        data: {
          createRecipe: { ok, recipe },
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
                recipes: data.getAllRecipes.recipes.concat(recipe),
              },
            },
          });

          if (
            !meQueryLoading &&
            me &&
            Object.prototype.hasOwnProperty.call(recipe, "userUUID") &&
            Object.prototype.hasOwnProperty.call(recipe.userUUID, "_id")
          ) {
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
                  recipes: data.getRecipeByUserUUID.recipes.concat(recipe),
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

  const [
    updateRecipeById,
    { loading: updateRecipeByIdLoading, error: updateRecipeByIdError },
  ] = useMutation(UPDATE_RECIPE_BY_ID, {
    update: (
      store,
      {
        data: {
          updateRecipeById: { ok, recipe },
        },
      }
    ) => {
      try {
        if (ok && recipe) {
          let data = store.readQuery({
            query: GET_ALL_RECIPES,
          });

          let idx = data.getAllRecipes.recipes.findIndex(
            (e) => e._id.toString() === recipe._id.toString()
          );

          data.getAllRecipes.recipes[idx] = recipe;

          store.writeQuery({
            query: GET_ALL_RECIPES,
            data,
          });
          if (
            !meQueryLoading &&
            me &&
            Object.prototype.hasOwnProperty.call(recipe, "userUUID") &&
            Object.prototype.hasOwnProperty.call(recipe.userUUID, "_id")
          ) {
            data = store.readQuery({
              query: GET_RECIPES_BY_USER_ID,
              variables: {
                userUUID: me?._id,
              },
            });

            idx = data.getRecipeByUserUUID.recipes.findIndex(
              (e) => e._id.toString() === recipe._id.toString()
            );

            data.getRecipeByUserUUID.recipes[idx] = recipe;

            store.writeQuery({
              query: GET_RECIPES_BY_USER_ID,
              variables: {
                userUUID: me?._id,
              },
              data,
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
      createRecipeLoading ||
      meQueryLoading ||
      updateRecipeByIdLoading ||
      getRecipeByIdLoading;

    // Error view
    error =
      createRecipeError ||
      meQueryError ||
      updateRecipeByIdError ||
      getRecipeByIdError;

    if (error) {
      throw error;
    }

    return (
      <AddRecipeContext.Provider
        value={{
          updateRecipeByIdLoading,
          createRecipeLoading,
          history,
          loading,
          recipe: editedRecipe,
          recipeUUID,
          // Hooks
          // Data from server
          // Mutation
          uploadFile,
          createRecipe,
          updateRecipeById,
        }}
      >
        {children}
      </AddRecipeContext.Provider>
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
