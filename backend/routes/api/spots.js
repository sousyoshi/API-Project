const express = require("express")

const {Spot} = require('../../db/models')
const router = express.Router()

router.get("/", async (req, res)=>{
const Spots = await Spot.findAll()

return res.json({Spots})



})











module.exports = router
