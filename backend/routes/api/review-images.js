const express = require("express");
const { requireAuth } = require("../../utils.js/auth");
const { Review, ReviewImage, Spot, User } = require("../../db/models");
const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res) => {
  const { user } = req;
  const reviewImage = await ReviewImage.findByPk(req.params.imageId, {
    include: { model: Review },
    where: { userId: user.id },
  });
  if(!reviewImage) res.status(404).json({message: `Review image couldn't be found`})
  await reviewImage.destroy()
  res.json({message: "Successfully deleted"});
});

module.exports = router;
