const { Router } = require("express");

const authController = require("../../controllers/web/authController");
const { authenticated } = require("../../middlewares/auth");

const router = new Router();

router.get("/register", authController.register);
router.post("/register", authController.registerProcess);
router.get("/login", authController.login);
router.post("/login", authController.loginProcess, authController.rememberMe);
router.get("/logout", authenticated, authController.logout);

module.exports = router;
