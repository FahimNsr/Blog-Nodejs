const { Router } = require("express");

const authController = require("../../controllers/api/authController");
const { authenticated } = require("../../middlewares/auth");

const router = new Router();

router.post("/register", authController.registerProcess);
router.post("/login", authController.loginProcess);

module.exports = router;
