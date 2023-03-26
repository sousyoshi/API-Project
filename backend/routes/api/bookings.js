const express = require("express");
const { requireAuth } = require("../../utils.js/auth");
const { Booking, Spot, SpotImage, User } = require("../../db/models");
const router = express.Router();

router.get("/current", requireAuth, async (req, res) => {
    const {user} = req
  const bookArr = [];
  const userBookings = await user.getBookings({include: Spot})
  const image = await user.getSpots({include: SpotImage})

     bookArr.push(userBookings)


  res.json({ Bookings: bookArr });
});

router.delete("/:bookingId", requireAuth, async (req, res) => {
  const booking = await Booking.findByPk(req.params.bookingId, { where: { userId: req.user.id } });
  if (booking.userId !== req.user.id) return res.status(403).json({ message: "Forbidden" });
  if (!booking) return res.status(404).json({ message: `Booking couldn't be found` });
  await booking.destroy();
  return res.json({ message: "Successfully deleted" });
});

module.exports = router;
