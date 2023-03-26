const express = require("express");
const { requireAuth } = require("../../utils.js/auth");
const { Booking, Spot, User } = require("../../db/models");
const router = express.Router();

router.get('/current', requireAuth, async(req, res)=>{
    const bookArr = []
    const bookings = await Booking.findAll({include: {model: Spot},where: {userId: req.user.id}})



    bookings.forEach(el => {
        bookArr.push(el.toJSON())

    });
    res.json({Bookings:bookArr})
})

router.delete('/:bookingId', requireAuth, async(req, res)=>{
    const booking = await Booking.findByPk(req.params.bookingId,{where: {userId: req.user.id}})
    if(!booking) res.status(404).json({message: `Booking couldn't be found`});
    await booking.destroy()
    res.json({message: "Successfully deleted"})
})


module.exports = router;
