const { Router } = require("express");

const homeController = require('../../controllers/api/homeController');

const router = new Router();

router.get("/", homeController.home);


module.exports = router;
