const showsService = require("../servicess/showServicess");

async function createShow(req, res) {
  try {
    const { name, startTime, totalSeats } = req.body;

    if (!name || !startTime || typeof totalSeats !== "number") {
      return res.status(400).json({
        error: "name, startTime and totalSeats are required",
      });
    }

    const show = await showsService.createShow({
      name,
      startTime: new Date(startTime),
      totalSeats,
    });

    res.status(201).json(show);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
}

async function listShows(req, res) {
  try {
    const shows = await showsService.listShows();
    res.json(shows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
}

async function getShow(req, res) {
  try {
    const show = await showsService.getShowById(req.params.id);

    if (!show) {
      return res.status(404).json({ error: "Show not found" });
    }

    res.json(show);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
}

async function updateShow(req, res) {
  try {
    const { name, startTime, totalSeats } = req.body;

    const updatedShow = await showsService.updateShow(req.params.id, {
      name,
      startTime,
      totalSeats,
    });

    if (!updatedShow) {
      return res.status(404).json({ error: "Show not found" });
    }

    res.json(updatedShow);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
}

async function deleteShow(req, res) {
  try {
    const deleted = await showsService.deleteShow(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Show not found" });
    }

    res.json({
      message: "Show deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
}

module.exports = {
  createShow,
  listShows,
  getShow,
  updateShow,
  deleteShow,
};