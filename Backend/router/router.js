const { Router } = require("express");
const controller = require("../controllers/appController");
const { auth, localVariables } = require("../middleware/auth");
const router = Router();

router.route("/register").post(controller.register);
router.route("/registerMail").post();
router
  .route("/authenticate")
  .post(controller.verifyUser, (req, res) =>
    res.status(200).send({ msg: "User found" })
  );
router.route("/login").post(controller.verifyUser, controller.login);

router.route("/user/:userName").get(controller.getUser);
router
  .route("/generateOTP")
  .get(controller.verifyUser, localVariables, controller.generateOTP);
router.route("/verifyOTP").get(controller.verifyUser, controller.verifyOTP);
router.route("/createResetSession").get(controller.resetCreateSession);

router.route("/updateuser").put(auth, controller.updateUser);
router
  .route("/resetPassword")
  .put(controller.verifyUser, controller.resetPassword);

module.exports = router;
