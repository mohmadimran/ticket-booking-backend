const { Schema, model, Types } = require('mongoose');

const BookingSchema = new Schema({
  showId: { type: Types.ObjectId, ref: 'Show', required: true },
  userName: { type: String },
  seats: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'FAILED'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

BookingSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = model('Booking', BookingSchema);
