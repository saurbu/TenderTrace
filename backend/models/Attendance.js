import mongoose from 'mongoose'
const AttendanceSchema = new mongoose.Schema(
  {
    tenderId: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    shift: {
      type: String,
      required: true,
    },

    // NEW FIELD
    attendanceStatus: {
      type: String,
      enum: ["Completed", "Holiday"],
      default: "Completed",
    },

    totalWorkers: {
      type: Number,
      default: 0,
    },

    presentWorkers: {
      type: Number,
      default: 0,
    },

    absentWorkers: {
      type: Number,
      default: 0,
    },

    records: [
      {
        workerId: String,

        workerName: {
          type: String,
          default: "",
        },

        designation: {
          type: String,
          default: "",
        },

        mobile: {
          type: String,
          default: "",
        },

        status: {
          type: String,
          enum: ["Present", "Absent"],
          default: "Absent",
        },

        isFraud: {
          type: Boolean,
          default: false,
        },

        photoUrl: {
          type: String,
          default: "",
        }
      },
    ],
  },
  {
    timestamps: true,
  }
);

AttendanceSchema.index(
  {
    tenderId: 1,
    date: 1,
    shift: 1,
  },
  {
    unique: true,
  }
);
const Attendance = mongoose.model("Attendance", AttendanceSchema);

export default Attendance 