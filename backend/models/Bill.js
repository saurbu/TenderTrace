import mongoose from "mongoose";
import bcrypt from "bcrypt";

const billSchema = new mongoose.Schema(
  {
    // ✅ BILL ID
    id: {
      type: String,
      required: true,
      unique: true
    },

    billTitle: {
      type: String,
      required: true
    },

    wardNo: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    constructionType: {
      type: String,
      default: "Government"
    },

    department: {
      type: String,
      required: true
    },

    status: {
      type: String,
      default: "Upcoming"
    },

    budget: {
      type: Number,
      required: true
    },

    timePeriod: {
      type: Number,
      default: 12
    },

    targetDate: {
      type: String
    },

    pin: {
      type: String,
      required: true
    },

    summary: {
      type: String
    },

    location: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// ✅ AUTO HASH PASSWORD
billSchema.pre("save", async function (next) {

  try {

    if (!this.isModified("password")) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);

    this.password =
      await bcrypt.hash(this.password, salt);

    next();

  } catch (error) {

    next(error);

  }

});

const Bill =
  mongoose.models.Bill ||
  mongoose.model("Bill", billSchema);

export default Bill;