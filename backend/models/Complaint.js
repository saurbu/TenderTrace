import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
    },

    itemTitle: {
      type: String,
      required: true,
    },

    itemType: {
      type: String,
      enum: ["tender", "bill"],
      required: true,
    },
    itemCode: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
    },

    images: [
      {
        url: String,
        fileId: String,
      },
    ],

    status: {
      type: String,
      enum: ["Pending", "In Review", "Resolved"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);