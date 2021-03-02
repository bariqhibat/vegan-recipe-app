import mon from "mongoose";

import Users from "./mongo/Users.js";
import Recipes from "./mongo/Recipes.js";

export const mongo = {
  mon,
  Recipes,
  Users,
};
