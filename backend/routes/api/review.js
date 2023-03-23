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


router.delete('/:reviewId', requireAuth, async(req, res)=>{
const {user} = req;

const review = await Review.findByPk(req.params.reviewId, {
  where: {
    userId: user.id
  }
})
if(!review) res.json({message: `Review couldn't be found`})
await review.destroy()
res.json({message: "Successfully deleted"})
})

module.exports = router;
