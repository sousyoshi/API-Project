const express = require("express");
const { requireAuth } = require("../../utils.js/auth");
const { handleValidationErrors } = require("../../utils.js/validation");
const { check } = require("express-validator");
const { Review, ReviewImage, Spot, User } = require("../../db/models");
const router = express.Router();

const validateReviewItems = [
  check("review").exists({ checkFalsy: true }).withMessage("Review text is required"),
  check("stars").exists({ checkFalsy: true }).isFloat({ min: 1, max: 5 }).withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

const validReviewImageItems = [check("url").exists({ checkFalsy: true }).withMessage("URL must be provided"), handleValidationErrors];

router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;
  const { id } = user;

  const Reviews = await Review.findAll({
    include: [
      {
        model: User,
        attributes: { exclude: ["username", "email", "hashedPassword", "createdAt", "updatedAt"] },
      },
      {
        model: Spot,
        attributes: {
          exclude: ["description"],
        },
      },
      {
        model: ReviewImage,
      },
    ],
    where: {
      userId: id,
    },
  });

  return res.json({ Reviews });
});

router.post("/:reviewId/images", [requireAuth, validReviewImageItems], async (req, res) => {
  const { user } = req;
  const { id } = user;
  const { url } = req.body;
  let userReview = await Review.findByPk(req.params.reviewId, {
    where: {
      userId: id,
    },
  });
  if (!userReview) res.json({ message: `Review couldn't be found` });
  const numOfImages = await userReview.getReviewImages();

  if (numOfImages.length === 10) return res.status(403).json({ message: "Maximum number of images for this resource was reached" });

  let newImage = await ReviewImage.create({
    reviewId: req.params.reviewId,
    url,
  });
  newImage = newImage.toJSON();
  delete newImage.reviewId;
  delete newImage.createdAt;
  delete newImage.updatedAt;

   return res.json(newImage);
});

router.put("/:reviewId", [requireAuth, validateReviewItems], async (req, res) => {
  const { user } = req;
  const { review, stars } = req.body;
  const reviewToUpdate = await Review.findByPk(req.params.reviewId);
  if (!reviewToUpdate) return res.status(404).json({ message: `Review couldn't be found` });

  if (reviewToUpdate.userId !== user.id) return res.status(403).json({ message: "Forbidden" });
  reviewToUpdate.review = review;
  reviewToUpdate.stars = stars;
  await reviewToUpdate.save;
  return res.json(reviewToUpdate);
});

router.delete("/:reviewId", requireAuth, async (req, res) => {
  const { user } = req;

  const review = await Review.findByPk(req.params.reviewId);
  if (review.userId !== user.id) {
    res.status(403).json({
      message: "Forbidden",
    });
  }
  if (!review) res.json({ message: `Review couldn't be found` });
  await review.destroy();
  res.json({ message: "Successfully deleted" });
});

module.exports = router;
