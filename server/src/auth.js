import jwt from "jsonwebtoken";
import { pick } from "lodash";
import bcrypt from "bcrypt";

export const createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign(
    {
      user: pick(user, ["_id"]),
    },
    secret,
    {
      expiresIn: "1h",
    }
  );

  const createRefreshToken = jwt.sign(
    {
      user: pick(user, "_id"),
    },
    secret2,
    {
      expiresIn: "7d",
    }
  );

  return [createToken, createRefreshToken];
};

export const refreshTokens = async (
  token,
  refreshToken,
  models,
  SECRET,
  SECRET2
) => {
  let userId = 0;
  try {
    const {
      user: { _id },
    } = jwt.decode(refreshToken);
    userId = _id;
  } catch (err) {
    return {};
  }

  if (!userId) {
    return {};
  }

  const user = await models.Users.findById(userId);

  if (!user) {
    return {};
  }

  const refreshSecret = user.password + SECRET2;

  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await createTokens(
    user,
    SECRET,
    refreshSecret
  );
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

export const tryLogin = async (email, password, mongo, SECRET, SECRET2) => {
  const user = await mongo.Users.findOne({ email });
  if (!user) {
    // user with provided email not found
    return {
      ok: false,
      errors: [{ path: "email", message: "Wrong email" }],
    };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    // bad password
    return {
      ok: false,
      errors: [{ path: "password", message: "Wrong password" }],
    };
  }

  const refreshTokenSecret = user.password + SECRET2;

  const [token, refreshToken] = await createTokens(
    user,
    SECRET,
    refreshTokenSecret
  );

  return {
    ok: true,
    user,
    token,
    refreshToken,
  };
};
