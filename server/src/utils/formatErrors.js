import mon from "mongoose";
import { pick } from "lodash";

const formatErrors = (e) => {
  if (e instanceof mon.Error.ValidationError) {
    return Object.keys(e.errors).map((keyName) => {
      return pick(e.errors[keyName].properties, ["path", "message"]);
    });
  }

  return [{ path: "name", message: "something went wrong" }];
};

export default formatErrors;
