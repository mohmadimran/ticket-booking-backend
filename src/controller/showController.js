const showsService = require('../servicess/showServicess');

async function createShow(req, res) {
  try {
  const { name, startTime, totalSeats } = req.body;
    if (!name || !startTime || typeof totalSeats !== "number") {
      return res.status(400).json({ error: 'name, start time and total seats are required' });
    }
    const show = await showsService.createShow({name,
    startTime: new Date(startTime),
    totalSeats });
    res.status(201).json(show);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal error' });
  }
}

async function listShows(req, res) {
  try {
    const shows = await showsService.listShows();
    res.json(shows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
}

async function getShow(req, res) {
  try {
    const show = await showsService.getShowById(req.params.id);
    if (!show) return res.status(404).json({ error: 'Not found' });
    res.json(show);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
}

module.exports = {
  createShow,
  listShows,
  getShow
};
