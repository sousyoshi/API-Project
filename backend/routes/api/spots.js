const express = require("express");
const { where } = require("sequelize");

const { Spot, ReviewImage, Review, User, SpotImage, sequelize } = require("../../db/models");
const { requireAuth } = require("../../utils.js/auth");
const { handleValidationErrors } = require("../../utils.js/validation");
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
      attributes: [[sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]],
    });

    let data = parseFloat(reviewData.toJSON().avgRating).toFixed(1);

    spot.avgRating = +data;
  }
  res.json({ spotList });
});

router.post("/", requireAuth, async (req, res, next) => {
  const { user } = req;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const newSpot = await Spot.create({
    ownerId: user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  res.status(201).json(newSpot);
});

router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const Spots = await Spot.findAll({
    include: {
      model: SpotImage,
    },
    where: { ownerId: user.id },
  });
  let userSpotList = [];
  Spots.forEach((spot) => {
    userSpotList.push(spot.toJSON());
  });
  for (let i = 0; i < userSpotList.length; i++) {
    let spot = userSpotList[i];
    for (let j = 0; j < spot.SpotImages.length; j++) {
      let image = spot.SpotImages[j];
      if (image.preview === true) {
        spot.previewImage = image.url;
      }
      if (!spot.previewImage || !spot.previewImage.length) {
        spot.previewImage = "no image found";
      }
    }
    delete spot.SpotImages;

    const reviewData = await Review.findOne({
      where: {
        spotId: spot.id,
      },
      attributes: [[sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]],
    });

    let data = parseFloat(reviewData.toJSON().avgRating).toFixed(1);

    spot.avgRating = +data;
  }

  return res.json({ userSpotList });
});

router.get("/:spotId", async (req, res) => {
  const spotArr = [];
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [
      {
        model: SpotImage,
        attributes: { exclude: ["createdAt", "updatedAt", "spotId"] },
      },
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });
  if (!spot) res.status(404).json({ message: `Spot couldn't be found` });

  const numOfReviews = await Review.count({ where: { spotId: req.params.spotId } });
  const sumOfStars = await Review.sum("stars", { where: { spotId: req.params.spotId } });

  spotArr.push(spot.toJSON());

  for (let i = 0; i < spotArr.length; i++) {
    const spotObj = spotArr[i];
    spotObj.numReviews = numOfReviews;
    spotObj.avgStarRating = +(sumOfStars / numOfReviews).toFixed(2);
  }
  res.json(spotArr);
});

router.get("/:spotId/reviews", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  const Reviews = await spot.getReviews({ include: [User, ReviewImage] });
  if (!spot) res.status(404).json({ message: `Spot couldn't be found` });
  res.json({ Reviews });
});

router.put("/:spotId", requireAuth, async (req, res) => {
  const { user } = req;

  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const spot = await Spot.findByPk(req.params.spotId, {
    where: {
      ownerId: user.id,
    },
  });
  if (!spot) res.json({ message: `Spot couldn't be found` });
  await spot.update({
    ownerId: user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  res.json(spot);
});

router.delete("/:spotId", requireAuth, async (req, res) => {
  const { user } = req;

  const spot = await Spot.findByPk(req.params.spotId, {
    where: {
      ownerId: user.id,
    },
  });

  if (!spot) res.json({ message: `Spot couldn't be found` });
  await spot.destroy();
  res.json({ message: "Successfully deleted" });
});

module.exports = router;
