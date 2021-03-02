import bcrypt from "bcrypt";
import { Types } from "mongoose";
import formatErrors from "../../utils/formatErrors";
import { tryLogin } from "../../auth";

const resolvers = {
  Query: {
    meQuery: async (_, { userUUID }, { user: userContext, mongo }) => {
      try {
        let user = null;

        if (userContext) {
          user = await mongo.Users.findOne({
            $or: [
              { _id: Types.ObjectId(userContext._id) },
              { _id: Types.ObjectId(userUUID) },
            ],
          });
        } else {
          user = await mongo.Users.findOne({
            _id: Types.ObjectId(userUUID),
          });
        }

        return {
          ok: true,
          user,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err),
        };
      }
    },
    getUserById: async (_, { userUUID }, { mongo }) => {
      const user = await mongo.Users.findById(userUUID);

      return {
        ok: true,
        user,
      };
    },
    getAllUsers: async (_, __, { mongo }) => {
      try {
        const users = await mongo.Users.find();

        return {
          ok: true,
          users,
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
    login: async (_, { email, password }, { mongo, SECRET, SECRET2 }) => {
      try {
        const response = await tryLogin(
          email,
          password,
          mongo,
          SECRET,
          SECRET2
        );

        return response;
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err),
        };
      }
    },
    createUser: async (
      _,
      { firstName, lastName, email, password },
      { mongo }
    ) => {
      try {
        // ! HASH PASSWORD BCRYPT
        const hashedPassword = await bcrypt.hash(password, 10);

        const userExists = await mongo.Users.findOne({ email }).select("_id");

        if (userExists) {
          return {
            ok: false,
            errors: [
              {
                path: "email",
                message: "Email already exists",
              },
            ],
          };
        }

        const user = new mongo.Users({
          firstName,
          lastName,
          email,
          password: hashedPassword,
        });

        await user.save();

        return {
          ok: true,
          user,
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
