import mon, { Schema } from "mongoose";

const Recipes = Schema({
  title: {
    type: String,
    required: [true, "Title is required!"],
    lowercase: true,
    trim: true,
  },
  image: {
    type: String,
  },
  ingredients: [
    {
      name: {
        type: String,
        required: [true, "Ingredient name is required!"],
        lowercase: true,
        trim: true,
      },
      amount: {
        type: Number,
        required: [true, "Ingredient amount is required!"],
        lowercase: true,
        trim: true,
        default: 0,
      },
    },
  ],
  instructions: [
    {
      type: String,
      required: [true, "Instruction is required!"],
      lowercase: true,
      trim: true,
    },
  ],
  userUUID: {
    type: Schema.Types.ObjectId,
  },
});

export default mon.model("recipes", Recipes);
