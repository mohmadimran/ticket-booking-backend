const { Schema, model } = require('mongoose');

const ShowSchema = new Schema({
  name: { type: String, required: true },
  startTime: { type: Date, required: true },
  totalSeats: { type: Number, required: true, min: 0 },
  reservedSeats: { type: Number, default: 0, min: 0 },
  confirmedSeats: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

ShowSchema.virtual('availableSeats').get(function () {
  return this.totalSeats - (this.reservedSeats + this.confirmedSeats);
});

ShowSchema.set('toJSON', { virtuals: true });
ShowSchema.set('toObject', { virtuals: true });

module.exports = model('Show', ShowSchema);
