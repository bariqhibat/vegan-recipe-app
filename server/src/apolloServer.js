import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import jwt from "jsonwebtoken";

import { storeUpload } from "./fileUpload";
import { refreshTokens } from "./auth";
import { mongo } from "./models/index";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

const SECRET = "asiodfhoi1hoi23jnl1kejd";
const SECRET2 = "asiodfhoi1hoi23jnl1kejasdjlkfasdd";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
});

export const authMiddleware = async (req, res, next) => {
  const token = req.headers["x-token"];
  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers["x-refresh-token"];
      const newTokens = await refreshTokens(
        token,
        refreshToken,
        mongo,
        SECRET,
        SECRET2
      );
      if (newTokens.token && newTokens.refreshToken) {
        res.set("Access-Control-Expose-Headers", "x-token, x-refresh-token");
        res.set("x-token", newTokens.token);
        res.set("x-refresh-token", newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};

export const apolloServer = new ApolloServer({
  schema,
  context: async ({ req, connection }) => {
    if (connection) {
      return connection.context;
    }
    return {
      mongo,
      user: req.user,
      SECRET,
      SECRET2,
      storeUpload,
    };
  },
});
