import mon, { Schema } from "mongoose";
import beautifyUnique from "mongoose-beautiful-unique-validation";

const Users = Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    lowercase: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: "Email already exists",
    lowercase: true,
    trim: true,
    index: true,
    match: [
      // eslint-disable-next-line
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Invalid email format",
    ],
  },
  password: {
    type: String,
    minlength: [5, "Password must be longer than 5 chars"],
    maxlength: [64, "Password must be shorter than 65 chars"],
  },
});

// Enable beautifying on this schema
Users.plugin(beautifyUnique);

export default mon.model("users", Users);
