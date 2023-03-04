const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/authContr");
const { validateBody, authenticate, upload } = require("../../middlewars");
const {
  signupSchemaJoi,
  loginSchemaJoi,
  subscriptionSchemaJoi,
  emailSchemaJoi
} = require("../../models/user");

router.post("/signup", validateBody(signupSchemaJoi), ctrl.signup);
router.post("/login", validateBody(loginSchemaJoi), ctrl.login);
router.get("/logout", authenticate, ctrl.logout);
router.get("/current", authenticate, ctrl.getCurrent);
router.patch(
  "/subscription",
  authenticate,
  validateBody(subscriptionSchemaJoi),
  ctrl.subscription  
);
router.get("/verify/:verificationToken", ctrl.verify);
router.post("/verify",validateBody(emailSchemaJoi), ctrl.resendVerify);
router.patch("/avatars", authenticate, upload.single("avatarURL"), ctrl.updateAvatar);
module.exports = router;
