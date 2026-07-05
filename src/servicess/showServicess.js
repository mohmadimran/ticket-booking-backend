const Show = require("../models/Show");

async function createShow({ name, startTime, totalSeats }) {
  const show = new Show({
    name,
    startTime,
    totalSeats,
  });

  return show.save();
}

async function listShows() {
  const shows = await Show.find()
    .sort({ startTime: 1 })
    .lean()
    .exec();

  return shows.map((show) => ({
    ...show,
    availableSeats:
      show.totalSeats -
      (show.reservedSeats + show.confirmedSeats),
  }));
}

async function getShowById(id) {
  const show = await Show.findById(id).lean().exec();

  if (!show) {
    return null;
  }

  show.availableSeats =
    show.totalSeats -
    (show.reservedSeats + show.confirmedSeats);

  return show;
}

async function updateShow(id, data) {
  const updatedShow = await Show.findByIdAndUpdate(
    id,
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedShow;
}

async function deleteShow(id) {
  return await Show.findByIdAndDelete(id);
}

module.exports = {
  createShow,
  listShows,
  getShowById,
  updateShow,
  deleteShow,
};