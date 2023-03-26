const express = require("express");
const { requireAuth } = require("../../utils.js/auth");
const { Review, ReviewImage, Spot, User, SpotImage } = require("../../db/models");
const router = express.Router();



router.delete("/:imageId", requireAuth, async (req, res) => {
    const { user } = req;
    const spotImage = await SpotImage.findByPk(req.params.imageId, {
      include: { model: Spot },
      where: { userId: user.id },
    });
    if(!user) return res.status(403).json({message: "Forbidden"})
    if(!spotImage) res.status(404).json({message: `Spot image couldn't be found`})
    await spotImage.destroy()
    res.json({message: "Successfully deleted"});
  });



















module.exports = router
