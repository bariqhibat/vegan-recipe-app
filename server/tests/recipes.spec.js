import {
  CREATE_RECIPE,
  UPDATE_RECIPE_BY_ID,
  DELETE_RECIPE_BY_ID,
  GET_RECIPES_BY_USER_ID,
  GET_ALL_RECIPES,
  GET_RECIPE_BY_ID,
} from "../../web/src/graphql/Recipes";
import { EMAIL_SIGNUP } from "../../web/src/graphql/Users";
import { mutate, query } from "./utils/providers";

let data = {
  user: {
    _id: null,
    firstName: "Bariq",
    lastName: "Nurlis",
    email: "bariqnurlis@bariq.com",
    password: "lklklklk",
  },
  recipe: {
    title: "pepe",
    image:
      "https://static01.nyt.com/images/2016/09/28/us/17xp-pepethefrog_web1/28xp-pepefrog-articleLarge.jpg?quality=75&auto=webp&disable=upscale",
    ingredients: [
      {
        name: "carrot",
        amount: 2,
      },
      {
        name: "oregano",
        amount: 10,
      },
      {
        name: "pickles",
        amount: 2,
      },
    ],
    instructions: [
      "this is a test",
      "this is a test",
      "this is a test",
      "this is a test",
      "this is a test",
      "this is a test",
    ],
  },
};

describe("Query", () => {
  // ! Environment setup
  let recipeUUID = null;
  beforeEach(async () => {
    const res = await mutate(CREATE_RECIPE, {
      variables: {
        ...data.recipe,
      },
    });

    recipeUUID = res.data.createRecipe.recipe._id;
  });

  describe("getRecipeById", () => {
    describe("Successful", () => {
      test("Successful", async () => {
        const res = await query(GET_RECIPE_BY_ID, {
          variables: {
            recipeUUID,
          },
        });

        expect(res).toMatchObject({
          data: {
            getRecipeById: {
              ok: true,
              errors: null,
              recipe: {
                _id: expect.any(String),
                ...data.recipe,
              },
            },
          },
        });
      });
    });
    describe("Unsuccessful", () => {
      test("Missing args", async () => {
        await expect(async () => {
          await mutate(GET_RECIPE_BY_ID).catch((err) => {
            throw err;
          });
        }).rejects.toThrowErrorMatchingSnapshot();
      });
      describe("Wrong type of args", () => {
        it.each`
          email
          ${""}
          ${3123}
          ${[3123, 312]}
          ${["asdasd", "dasda"]}
          ${null}
          ${undefined}
        `("'$recipeUUID' of recipeUUID variant", async ({ recipeUUID }) => {
          if (recipeUUID !== null && recipeUUID !== undefined) {
            const res = await mutate(CREATE_RECIPE, {
              variables: {
                recipeUUID,
              },
            });

            expect(res).toMatchSnapshot();
            expect(res).toMatchObject({
              data: {
                getRecipeById: {
                  ok: false,
                  recipe: null,
                },
              },
            });
          } else {
            await expect(async () => {
              await mutate(CREATE_RECIPE, {
                variables: {
                  recipeUUID,
                },
              }).catch((err) => {
                throw err;
              });
            }).rejects.toThrowErrorMatchingSnapshot();
          }
        });
      });
    });
  });
  describe("getRecipeByUserUUID", () => {
    let userUUID = null;
    beforeEach(async () => {
      const {
        data: {
          createUser: {
            user: { _id },
          },
        },
      } = await mutate(EMAIL_SIGNUP, {
        variables: {
          ...data.user,
        },
      });

      userUUID = _id;

      await mutate(CREATE_RECIPE, {
        variables: {
          ...data.recipe,
          userUUID,
        },
      });
    });

    describe("Successful", () => {
      test("Successful", async () => {
        const res = await query(GET_RECIPES_BY_USER_ID, {
          variables: {
            userUUID,
          },
        });

        expect(res).toMatchObject({
          data: {
            getRecipeByUserUUID: {
              ok: true,
              recipes: [
                {
                  _id: expect.any(String),
                  ...data.recipe,
                },
              ],
            },
          },
        });
      });
    });
    describe("Unsuccessful", () => {});
  });
  describe("getAllRecipes", () => {
    describe("Successful", () => {
      test("Successful", async () => {
        const res = await query(GET_ALL_RECIPES);

        expect(res).toMatchObject({
          data: {
            getAllRecipes: {
              ok: true,
              recipes: [
                {
                  _id: expect.any(String),
                  ...data.recipe,
                },
              ],
            },
          },
        });
      });
    });
    describe("Unsuccessful", () => {});
  });
});
describe("Mutation", () => {
  describe("createRecipe", () => {
    describe("Successful", () => {
      test("Non-user", async () => {
        const res = await mutate(CREATE_RECIPE, {
          variables: {
            ...data.recipe,
          },
        });

        expect(res).toMatchObject({
          data: {
            createRecipe: {
              ok: true,
              recipe: {
                _id: expect.any(String),
                ...data.recipe,
              },
            },
          },
        });
      });
      // ! Unable since requires express middleware
      test("User", async () => {
        const {
          data: {
            createUser: {
              user: { _id: userUUID },
            },
          },
        } = await mutate(EMAIL_SIGNUP, {
          variables: {
            ...data.user,
          },
        });

        const res = await mutate(CREATE_RECIPE, {
          variables: {
            ...data.recipe,
            userUUID,
          },
        });

        expect(res).toMatchObject({
          data: {
            createRecipe: {
              ok: true,
              recipe: {
                _id: expect.any(String),
                ...data.recipe,
              },
            },
          },
        });
      });
    });
    describe("Unsuccessful", () => {
      test("Missing args", async () => {
        await expect(async () => {
          await mutate(CREATE_RECIPE).catch((err) => {
            throw err;
          });
        }).rejects.toThrowErrorMatchingSnapshot();
      });
      describe("Wrong type of args", () => {
        it.each`
          email
          ${""}
          ${"bobby"}
          ${3123}
          ${["asdasd", "dasda"]}
          ${null}
          ${undefined}
        `("'$ingredients' of ingredients variant", async ({ ingredients }) => {
          if (typeof ingredients === "string") {
            const res = await mutate(CREATE_RECIPE, {
              variables: {
                ...data.recipe,
                ingredients,
              },
            });

            expect(res).toMatchSnapshot();
            expect(res).toMatchObject({
              data: {
                createUser: {
                  ok: false,
                  user: null,
                },
              },
            });
          } else {
            await expect(async () => {
              await mutate(CREATE_RECIPE, {
                variables: {
                  ...data.user,
                  ingredients,
                },
              }).catch((err) => {
                throw err;
              });
            }).rejects.toThrowErrorMatchingSnapshot();
          }
        });
      });
    });
  });
  describe("updateRecipeById", () => {
    let recipeUUID = null;
    beforeEach(async () => {
      const res = await mutate(CREATE_RECIPE, {
        variables: {
          ...data.recipe,
        },
      });

      recipeUUID = res.data.createRecipe.recipe._id;
    });

    describe("Successful", () => {
      test("Successful", async () => {
        const res = await mutate(UPDATE_RECIPE_BY_ID, {
          variables: {
            ...data.recipe,
            title: "Changed title",
            recipeUUID,
          },
        });

        expect(res).toMatchObject({
          data: {
            updateRecipeById: {
              ok: true,
              errors: null,
              recipe: {
                _id: expect.any(String),
                title: "Changed title",
                ...data.recipe,
              },
            },
          },
        });
      });
    });
    describe("Unsuccessful", () => {
      test("Missing args", async () => {
        await expect(async () => {
          await mutate(UPDATE_RECIPE_BY_ID).catch((err) => {
            throw err;
          });
        }).rejects.toThrowErrorMatchingSnapshot();
      });
    });
  });
  describe("deleteRecipeById", () => {
    let recipeUUID = null;
    beforeEach(async () => {
      const res = await mutate(CREATE_RECIPE, {
        variables: {
          ...data.recipe,
        },
      });

      recipeUUID = res.data.createRecipe.recipe._id;
    });

    describe("Successful", () => {
      test("Successful", async () => {
        const res = await mutate(DELETE_RECIPE_BY_ID, {
          variables: {
            recipeUUID,
          },
        });

        expect(res).toMatchObject({
          data: {
            deleteRecipeById: {
              ok: true,
              errors: null,
              recipe: {
                _id: expect.any(String),
                ...data.recipe,
              },
            },
          },
        });
      });
    });
    describe("Unsuccessful", () => {
      test("Missing recipe", async () => {
        await mutate(DELETE_RECIPE_BY_ID, {
          variables: {
            recipeUUID,
          },
        });

        const res = await mutate(DELETE_RECIPE_BY_ID, {
          variables: {
            recipeUUID,
          },
        });

        expect(res).toMatchSnapshot();
      });
      test("Missing args", async () => {
        await expect(async () => {
          await mutate(DELETE_RECIPE_BY_ID).catch((err) => {
            throw err;
          });
        }).rejects.toThrowErrorMatchingSnapshot();
      });
    });
  });
});
