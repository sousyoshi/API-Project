const express = require("express");

const { Spot, ReviewImage, Review, User, SpotImage, Booking, sequelize } = require("../../db/models");
const { check } = require("express-validator");
const { requireAuth } = require("../../utils.js/auth");
const { handleValidationErrors } = require("../../utils.js/validation");
const router = express.Router();

const validateSpotItems = [
  check("address").exists({ checkFalsy: true }).withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country").exists({ checkFalsy: true }).withMessage("Country is required"),
  check("lat").exists({ checkFalsy: true }).isFloat({ min: -90, max: 90 }).withMessage("Latitude is not valid"),
  check("lng").exists({ checkFalsy: true }).isFloat({ min: -180, max: 180 }).withMessage("Longitude is not valid"),
  check("name").exists({ checkFalsy: true }).isLength({ max: 49 }).withMessage("Name must be less than 50 characters"),
  check("description").exists({ checkFalsy: true }).withMessage("Description is required"),
  check("price").exists({ checkFalsy: true }).isFloat({ min: 1 }).withMessage("Price per day is required"),
  handleValidationErrors,
];

const validateReviewItems = [
  check("review").exists({ checkFalsy: true }).withMessage("Review text is required"),
  check("stars").exists({ checkFalsy: true }).isFloat({ min: 1, max: 5 }).withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

const validateQuery = [
  check("page").isFloat({ min: 1 }).withMessage("Page must be greater than or equal to 1"),
  check("size").isFloat({ min: 1 }).withMessage("Size must be greater than or equal to 1"),
  handleValidationErrors,
];

router.get("/", async (req, res) => {
  let { page, size } = req.query;

  let pagination = {};

  size = size === undefined || size > 20 ? 20 : parseInt(size);
  page = page === undefined || page > 10 ? 1 : parseInt(page);

  if(page < 1 || size < 1) return res.json({message: 'Bad Request', errors: {page: "Page must be greater than or equal to 1", size: "Size must be greater than or equal to 1"}})

  pagination.limit = size;
  pagination.offset = size * (page - 1);

  const Spots = await Spot.findAll({ include: { model: SpotImage }, ...pagination });

  let spotList = [];
  Spots.forEach((spot) => {
    spotList.push(spot.toJSON());
  });

  for (let i = 0; i < spotList.length; i++) {
    let spot = spotList[i];

    for (let j = 0; j < spot.SpotImages.length; j++) {
      let image = spot.SpotImages[j];

      if (image.preview) {
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
  return res.json({ Spots: spotList, page, size });
});

router.post("/", [requireAuth, validateSpotItems], async (req, res, next) => {
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

  return res.status(201).json(newSpot);
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
      if (image.preview) {
        spot.previewImage = image.url;
      } else {
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

  return res.json({ Spots: userSpotList });
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
  res.json(spotArr[0]);
});

router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const { user } = req;
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) return res.status(404).json({ message: `Spot couldn't be found` });
  if (spot.dataValues.id !== user.id) {
    const nonUserSpot = await spot.getBookings({ attributes: { exclude: ["id", "userId", "createdAt", "updatedAt"] } });
    return res.json({ Bookings: nonUserSpot });
  } else {
    const spotBookings = await spot.getBookings({ include: { model: User } });
    return res.json({ Bookings: spotBookings });
  }
});

router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { user } = req;
  const { id } = user;
  const { url, preview } = req.body;
  const spot = await Spot.findByPk(req.params.spotId, { where: { ownerId: user.id } });

  if (!spot) return res.status(404).json({ message: `Spot couldn't be found` });
  if (spot.dataValues.ownerId !== user.id) return res.status(403).json({ message: "Forbidden" });
  if (user) {
    let newImage = await SpotImage.create({
      userId: id,
      spotId: req.params.spotId,
      url,
      preview,
    });
    newImage = newImage.toJSON();
    delete newImage.createdAt;
    delete newImage.updatedAt;

    return res.json(newImage);
  }
});

router.post("/:spotId/reviews", [requireAuth, validateReviewItems], async (req, res) => {
  const { user } = req;
  const { review, stars } = req.body;

  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) return res.status(404).json({ message: `Spot couldn't be found` });

  const userReview = await spot.getReviews(req.params.spotId);
   
  if (userReview.length) return res.status(403).json({ message: `User already has a review for this spot` });
  const newReview = await Review.create({
    spotId: req.params.spotId,
    userId: user.id,
    review,
    stars,
  });
  return res.status(201).json(newReview);
});

router.post("/:spotId/bookings", requireAuth, async (req, res) => {
  const bookArr = [];
  let { startDate, endDate } = req.body;
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return res.status(404).json({ message: `Spot couldn't be found` });

  if (endDate <= startDate)
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        endDate: "endDate cannot be on or before startDate",
      },
    });

  if (spot.dataValues.id === req.user.id) return res.json({ message: `Must not be user to book` });
  const bookings = await spot.getBookings();

  bookings.forEach((booking) => {
    bookArr.push(booking.toJSON());
  });
  for (let booking of bookArr) {
    const currStartDate = new Date(booking.startDate).getTime();
    const currEndDate = new Date(booking.endDate).getTime();
    startDate = new Date(startDate).getTime();
    endDate = new Date(endDate).getTime();

    if (startDate >= currStartDate && startDate <= currEndDate) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
        },
      });
    }
    if (endDate <= currEndDate && endDate >= currStartDate) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          endDate: "End date conflicts with an existing booking",
        },
      });
    }
  }
  const newBooking = await Booking.create({
    spotId: req.params.spotId,
    userId: req.user.id,
    startDate,
    endDate,
  });

  return res.json(newBooking);
});

router.get("/:spotId/reviews", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return res.status(404).json({ message: `Spot couldn't be found` });
  const Reviews = await spot.getReviews({ include: [User, ReviewImage] });
  return res.json({ Reviews });
});

router.put("/:spotId", [requireAuth, validateSpotItems], async (req, res) => {
  const { user } = req;

  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const spot = await Spot.findByPk(req.params.spotId, {
    where: {
      ownerId: user.id,
    },
  });
  if (!spot) return res.status(404).json({ message: `Spot couldn't be found` });
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

  return res.json(spot);
});

router.delete("/:spotId", requireAuth, async (req, _res) => {
  const { user } = req;

  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return _res.json({ message: `Spot couldn't be found` });
  if (user.id !== spot.ownerId) {
    return _res.status(403).json({
      message: "Forbidden",
    });
  }
  await spot.destroy();
  return _res.json({ message: "Successfully deleted" });
});
module.exports = router;
