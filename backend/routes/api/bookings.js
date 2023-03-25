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
    res.json(bookArr)
})


module.exports = router;
