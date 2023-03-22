const express = require("express");

const { Spot, Review, Booking, SpotImage, sequelize } = require("../../db/models");
const { requireAuth } = require("../../utils.js/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  const Spots = await Spot.findAll({ include: { model: SpotImage } });

  let spotList = [];
  Spots.forEach((spot) => {
    spotList.push(spot.toJSON());
  });

  for (let i = 0; i < spotList.length; i++) {
    let spot = spotList[i];
    for (let j = 0; j < spot.SpotImages.length; j++) {
      let image = spot.SpotImages[j];
      if (image.preview === true) {
        spot.previewImage = image.url;
      }
      if (!spot.previewImage) {
        spot.previewImage = "no image found";
      }
    }
    delete spot.SpotImages;
    const reviewData = await Review.findOne({
      where: {
        spotId: spot.id,
      },
      attributes: {
        include: [[sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]],
      },
    });

    let data = parseFloat(reviewData.toJSON().avgRating).toFixed(1);
    
    spot.avgRating = +data;
  }

  res.json({ spotList });
});

router.get("/current", requireAuth, async (req, res) => {
  let user = req.user
  console.log(user)
  const Spots = await Spot.findAll();

  return res.json({});
});

module.exports = router;
