const { Router } = require("express");

const postController = require('../../controllers/api/postController');

const router = new Router();

router.get("/", postController.posts);
router.get("/:id", postController.post);


module.exports = router;
