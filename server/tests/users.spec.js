import {
  ME_QUERY,
  EMAIL_SIGNUP,
  EMAIL_LOGIN,
} from "../../web/src/graphql/Users";
import { mutate, query } from "./utils/providers";

const data = {
  user: {
    _id: null,
    firstName: "Bariq",
    lastName: "Nurlis",
    email: "bariqnurlis@bariq.com",
    password: "lklklklk",
  },
};

describe("Query", () => {
  describe("meQuery", () => {
    let userUUID = null;
    beforeEach(async () => {
      const res = await mutate(EMAIL_SIGNUP, {
        variables: {
          ...data.user,
        },
      });

      userUUID = res.data.createUser.user._id;
    });

    describe("Successful", () => {
      test("Through args", async () => {
        const res = await query(ME_QUERY, {
          variables: {
            userUUID,
          },
        });

        expect(res).toMatchObject({
          data: {
            meQuery: {
              ok: true,
              user: {
                _id: expect.any(String),
                firstName: expect.any(String),
                lastName: expect.any(String),
                email: expect.any(String),
              },
            },
          },
        });
      });
      // ! Unable since requires express middleware
      test("Through headers", async () => {
        //   const mock = await mutate(EMAIL_LOGIN, {
        //     variables: {
        //       ...data.user,
        //     },
        //   });
        //   const { token, refreshToken } = mock.data.login;
        //   setOptions({
        //     request: {
        //       headers: {
        //         "x-token": token,
        //         "x-refresh-token": refreshToken,
        //       },
        //     },
        //     response: {
        //       headers: {
        //         "x-token": token,
        //         "x-refresh-token": refreshToken,
        //       },
        //     },
        //   });
        //   const res = await query(ME_QUERY);
        //   expect(res).toMatchObject({
        //     data: {
        //       meQuery: {
        //         ok: true,
        //         user: {
        //           _id: expect.any(String),
        //           firstName: expect.any(String),
        //           lastName: expect.any(String),
        //           email: expect.any(String),
        //         },
        //       },
        //     },
        //   });
      });
    });
    describe("Unsuccessful", () => {
      test("Missing args", async () => {});
    });
  });
});
describe("Mutation", () => {
  describe("createUser", () => {
    describe("Successful", () => {
      test("Successful", async () => {
        const res = await mutate(EMAIL_SIGNUP, {
          variables: {
            ...data.user,
          },
        });

        expect(res).toMatchObject({
          data: {
            createUser: {
              ok: true,
              errors: null,
            },
          },
        });
      });
    });
    describe("Unsuccessful", () => {
      test("User already exists", async () => {
        await mutate(EMAIL_SIGNUP, {
          variables: {
            ...data.user,
          },
        });

        const res = await mutate(EMAIL_SIGNUP, {
          variables: {
            ...data.user,
          },
        });

        expect(res).toMatchObject({
          data: {
            createUser: {
              ok: false,
              user: null,
            },
          },
        });
      }),
        test("Missing args", async () => {
          await expect(async () => {
            await mutate(EMAIL_SIGNUP).catch((err) => {
              throw err;
            });
          }).rejects.toThrowErrorMatchingSnapshot();
        });
      describe("Wrong type of args", () => {
        it.each`
          email
          ${""}
          ${"bobby"}
          ${null}
          ${undefined}
        `("'$email' of email variant", async ({ email }) => {
          if (typeof email === "string") {
            const res = await mutate(EMAIL_SIGNUP, {
              variables: {
                ...data.user,
                email,
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
              await mutate(EMAIL_SIGNUP, {
                variables: {
                  ...data.user,
                  email,
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
  describe("login", () => {
    beforeEach(async () => {
      await mutate(EMAIL_SIGNUP, {
        variables: {
          ...data.user,
        },
      });
    });

    describe("Successful", () => {
      test("Successful", async () => {
        const res = await mutate(EMAIL_LOGIN, {
          variables: {
            ...data.user,
          },
        });

        expect(res).toMatchObject({
          data: {
            login: {
              token: expect.any(String),
              refreshToken: expect.any(String),
              ok: true,
              user: {
                _id: expect.any(String),
              },
            },
          },
        });
      });
    });

    describe("Unsuccessful", () => {
      test("Missing args", async () => {
        await expect(async () => {
          await mutate(EMAIL_LOGIN).catch((err) => {
            throw err;
          });
        }).rejects.toThrowErrorMatchingSnapshot();
      });

      describe("Wrong type of args", () => {
        it.each`
          email
          ${""}
          ${"bobby"}
          ${null}
          ${undefined}
        `("'$email' of email variant", async ({ email }) => {
          if (typeof email === "string") {
            const res = await mutate(EMAIL_LOGIN, {
              variables: {
                ...data.user,
                email,
              },
            });

            expect(res).toMatchSnapshot();
            expect(res).toMatchObject({
              data: {
                login: {
                  ok: false,
                  user: null,
                  token: null,
                  refreshToken: null,
                },
              },
            });
          } else {
            await expect(async () => {
              await mutate(EMAIL_LOGIN, {
                variables: {
                  ...data.user,
                  email,
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
});
