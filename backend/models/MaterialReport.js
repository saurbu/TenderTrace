import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },

    materials: [
      {
        name: String,
        price: Number,
        quantity: Number,
        total: Number,

        images: {
          product: String,
          bill: String,
          barcode: String,
        },
      },
    ],

    totalSpend: {
      type: Number,
      default: 0,
    },

    tenderId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MaterialReport", materialSchema);