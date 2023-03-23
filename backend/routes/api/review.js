const express = require("express");
const { requireAuth } = require("../../utils.js/auth");
const { Review, ReviewImage, Spot, User } = require("../../db/models");
const router = express.Router();

router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;
  const { id } = user;

  const Reviews = await Review.findAll({
    include: [
      {
        model: User,
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
  res.json({ Reviews });
});

router.post("/:reviewId/images", requireAuth, async (req, res) => {
  const { user } = req;
  const { id } = user;
  const { url } = req.body;
  let userReview = await Review.findByPk(req.params.reviewId, {
    where: {
      userId: id,
    },
  });
  if (!userReview) res.json({ message: `Review couldn't be found` });
   const numOfImages = await ReviewImage.count()

    if(numOfImages >= 10)  res.status(403).json({message: "Maximum number of images for this resource was reached"})
     

  const newImage = await ReviewImage.create({
    reviewId: req.params.reviewId,
    url,
  });

  res.json(newImage);
});

router.delete("/:reviewId", requireAuth, async (req, res) => {
  const { user } = req;

  const review = await Review.findByPk(req.params.reviewId, {
    where: {
      userId: user.id,
    },
  });
  if (!review) res.json({ message: `Review couldn't be found` });
  await review.destroy();
  res.json({ message: "Successfully deleted" });
});

module.exports = router;
