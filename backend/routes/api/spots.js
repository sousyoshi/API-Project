const express = require("express");

const { Spot, Review, Booking, sequelize } = require("../../db/models");
const { requireAuth } = require("../../utils.js/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  const Spots = await Spot.findAll({});




  return res.json({Spots})

});

router.get("/current", requireAuth, async (req, res) => {
  const Spots = await Spot.findAll();

  return res.json({ });
});

module.exports = router;
