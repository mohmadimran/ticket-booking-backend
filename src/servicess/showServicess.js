const Show = require('../models/Show');

async function createShow({ name, startTime, totalSeats }) {
  const show = new Show({ name, startTime, totalSeats });
  return show.save();
}

async function listShows() {
  const shows = await Show.find().sort({ startTime: 1 }).lean().exec();
  return shows.map(s => ({
    ...s,
    availableSeats: s.totalSeats - (s.reservedSeats + s.confirmedSeats)
  }));
}

async function getShowById(id) {
  const s = await Show.findById(id).lean().exec();
  if (!s) return null;
  s.availableSeats = s.totalSeats - (s.reservedSeats + s.confirmedSeats);
  return s;
}

module.exports = {
  createShow,
  listShows,
  getShowById
};
