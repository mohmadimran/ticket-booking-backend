const { Schema, model, Types } = require("mongoose");

const BookingSchema = new Schema(
  {
    showId: {
      type: Types.ObjectId,
      ref: "Show",
      required: true,
    },

    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "CANCELLED",
        "FAILED"
      ],
      default: "PENDING"
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model("Booking", BookingSchema);