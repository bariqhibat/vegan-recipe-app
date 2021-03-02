import { gql } from "@apollo/client";

export const CREATE_RECIPE = gql`
  mutation(
    $title: String!
    $image: String
    $ingredients: [Ingredient_Input!]!
    $instructions: [String!]!
    $userUUID: String
  ) {
    createRecipe(
      title: $title
      image: $image
      ingredients: $ingredients
      instructions: $instructions
      userUUID: $userUUID
    ) {
      ok
      errors {
        path
        message
      }
      recipe {
        _id
        title
        image
        instructions
        userUUID {
          _id
        }
        ingredients {
          name
          amount
        }
      }
    }
  }
`;

export const UPDATE_RECIPE_BY_ID = gql`
  mutation(
    $recipeUUID: String!
    $title: String
    $image: String
    $ingredients: [Ingredient_Input!]
    $instructions: [String!]
  ) {
    updateRecipeById(
      recipeUUID: $recipeUUID
      title: $title
      image: $image
      ingredients: $ingredients
      instructions: $instructions
    ) {
      ok
      errors {
        path
        message
      }
      recipe {
        _id
        title
        image
        instructions
        userUUID {
          _id
        }
        ingredients {
          name
          amount
        }
      }
    }
  }
`;

export const DELETE_RECIPE_BY_ID = gql`
  mutation($recipeUUID: String!) {
    deleteRecipeById(recipeUUID: $recipeUUID) {
      ok
      errors {
        path
        message
      }
      recipe {
        _id
        title
        image
        instructions
        userUUID {
          _id
        }
        ingredients {
          name
          amount
        }
      }
    }
  }
`;

export const GET_ALL_RECIPES = gql`
  query {
    getAllRecipes {
      ok
      errors {
        path
        message
      }
      recipes {
        _id
        title
        image
        instructions
        userUUID {
          _id
        }
        ingredients {
          name
          amount
        }
      }
    }
  }
`;

export const GET_RECIPE_BY_ID = gql`
  query($recipeUUID: String!) {
    getRecipeById(recipeUUID: $recipeUUID) {
      ok
      errors {
        path
        message
      }
      recipe {
        _id
        title
        image
        userUUID {
          _id
          firstName
        }
        instructions
        ingredients {
          name
          amount
        }
      }
    }
  }
`;
export const GET_RECIPES_BY_USER_ID = gql`
  query($userUUID: String) {
    getRecipeByUserUUID(userUUID: $userUUID) {
      ok
      errors {
        path
        message
      }
      recipes {
        _id
        title
        image
        instructions
        userUUID {
          _id
        }
        ingredients {
          name
          amount
        }
      }
    }
  }
`;
