const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const spotsRouter = require("./spots.js")
const reviewsRouter = require('./review.js')
const reviewImageRouter = require('./review-images.js')
const spotImageRouter = require('./spot-images.js')
const { restoreUser } = require("../../utils.js/auth");

router.use(restoreUser);
router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use('/spots', spotsRouter)
router.use('/reviews', reviewsRouter)
router.use('/review-images', reviewImageRouter)
router.use('/spot-images', spotImageRouter)

router.post("/test", function (req, res) {
  res.json({ requestBody: req.body });
});
//  router.get("/restore-user", (req, res) => {
//   return res.json(req.user);
// });

// const { setTokenCookie } = require("../../utils.js/auth");
// const { User } = require("../../db/models");

// router.get("/set-token-cookie", async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: "Demo-lition",
//     },
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });
// const { requireAuth } = require('../../utils.js/auth');
// router.get(
//   '/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

module.exports = router;
