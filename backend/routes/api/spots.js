const express = require("express")

const {Spot, Booking, User} = require('../../db/models')
const router = express.Router()

router.get("/", async (req, res)=>{
const spots = await Spot.findAll({include: User})
const bookings = await Booking.findAll({include: User})
return res.json(bookings)



})











module.exports = router
