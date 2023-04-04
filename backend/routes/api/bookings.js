const express = require("express");
const { requireAuth } = require("../../utils.js/auth");
const { Booking, Spot, SpotImage, User } = require("../../db/models");
const router = express.Router();

router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;
  const bookArr = [];
  const userBookings = await user.getBookings({ include: Spot });

  userBookings.forEach((booking) => {
    bookArr.push(booking.toJSON());
  });

  for (let bookings of userBookings) {
    const userSpotImages = await bookings.Spot.getSpotImages();
    for (let i = 0; i < bookArr.length; i++) {
      for (let j = 0; j < userSpotImages.length; j++) {
        if (userSpotImages[j].dataValues.preview) bookArr[i].Spot.previewImage = userSpotImages[j].dataValues.url;
        else {
          bookArr[i].Spot.previewImage = "no image found";
        }
      }
    }
  }

  res.json({ Bookings: bookArr });
});

router.put("/:bookingId", requireAuth, async (req, res) => {
  let { startDate, endDate } = req.body;
  const booking = await Booking.findByPk(req.params.bookingId, { where: { userId: req.userId } });

  if (!booking) return res.status(404).json({ message: `Booking couldn't be found` });

  if(booking.userId !== req.user.id) return res.status(403).json({message: "Forbidden"})

  startDate = new Date(startDate).getTime();
  endDate = new Date(endDate).getTime();

  if (endDate <= startDate)
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        endDate: "endDate cannot be on or before startDate",
      },
    });

    const currStartDate = new Date(booking.startDate).getTime()
    const currEndDate = new Date(booking.endDate).getTime();

    if(startDate <= currStartDate) return res.status(403).json({message: `Past bookings can't be modified`})
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

    await booking.update({
      startDate, endDate
    })
    return res.json(booking)
});

router.delete("/:bookingId", requireAuth, async (req, res) => {
  const booking = await Booking.findByPk(req.params.bookingId);
  if (!booking) return res.status(404).json({ message: `Booking couldn't be found` });
  if (booking.userId !== req.user.id) return res.status(403).json({ message: "Forbidden" });
  const startDate = new Date(booking.startDate);
  const bookingStartDate = startDate.getTime();
  const todayDate = Date.now();
  if (todayDate >= bookingStartDate) return res.status(403).json({ message: "Bookings that have been started cannot be deleted" });
  await booking.destroy();
  return res.json({ message: "Successfully deleted" });
});

module.exports = router;
