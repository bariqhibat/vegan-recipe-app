import { Types } from "mongoose";
import formatErrors from "../../utils/formatErrors";

const resolvers = {
  Query: {
    getRecipeById: async (_, { recipeUUID }, { mongo }) => {
      try {
        const recipe = await mongo.Recipes.findById(recipeUUID).populate({
          path: "userUUID",
          model: mongo.Users,
        });

        return {
          ok: true,
          recipe,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err),
        };
      }
    },
    getRecipeByUserUUID: async (_, { userUUID }, { mongo, user }) => {
      try {
        let recipes = null;

        if (user) {
          recipes = await mongo.Recipes.find({
            $or: [
              {
                userUUID: Types.ObjectId(user._id),
              },
              {
                userUUID: Types.ObjectId(userUUID),
              },
            ],
          });
        } else {
          recipes = await mongo.Recipes.find({
            userUUID: Types.ObjectId(userUUID),
          });
        }

        return {
          ok: true,
          recipes,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err),
        };
      }
    },
    getAllRecipes: async (_, __, { mongo }) => {
      try {
        const recipes = await mongo.Recipes.find();

        return {
          ok: true,
          recipes,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err),
        };
      }
    },
  },
  Mutation: {
    createRecipe: async (
      _,
      { title, image, ingredients, instructions, userUUID },
      { mongo, user }
    ) => {
      try {
        let recipe = null;
        if (user) {
          recipe = new mongo.Recipes({
            title,
            image,
            ingredients,
            instructions,
            userUUID: user._id,
          });
          await recipe.save();
        } else if (userUUID) {
          recipe = new mongo.Recipes({
            title,
            image,
            ingredients,
            instructions,
            userUUID,
          });
          await recipe.save();
        } else {
          recipe = new mongo.Recipes({
            title,
            image,
            ingredients,
            instructions,
          });
          await recipe.save();
        }

        return {
          ok: true,
          recipe,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err),
        };
      }
    },
    updateRecipeById: async (
      _,
      { recipeUUID, title, image, ingredients, instructions },
      { mongo }
    ) => {
      try {
        // ! HASH PASSWORD BCRYPT
        const recipe = await mongo.Recipes.findOneAndUpdate(
          { _id: Types.ObjectId(recipeUUID) },
          {
            $set: {
              title,
              image,
              ingredients,
              instructions,
            },
          }
        );

        await recipe.save();

        return {
          ok: true,
          recipe,
        };
      } catch (err) {
        console.log({ err });
        return {
          ok: false,
          errors: formatErrors(err),
        };
      }
    },
    deleteRecipeById: async (_, { recipeUUID }, { mongo }) => {
      try {
        const recipe = await mongo.Recipes.findOneAndDelete({
          _id: Types.ObjectId(recipeUUID),
        });
        if (!recipe) {
          return {
            ok: false,
            errors: [
              {
                path: "recipe",
                message: "recipe didnt exist",
              },
            ],
          };
        }

        return {
          ok: true,
          recipe,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err),
        };
      }
    },
  },
};

export default resolvers;
