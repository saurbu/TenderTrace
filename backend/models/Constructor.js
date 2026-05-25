import mongoose from "mongoose";

const constructorSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      default: "Constructor",
    },
  },
  { timestamps: true }
);

const Constructor = mongoose.model("Constructor", constructorSchema);

export default Constructor;