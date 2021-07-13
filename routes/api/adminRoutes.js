const { Router } = require("express");

const adminController = require("../../controllers/api/adminController");

const { apiAuthenticated } = require("../../middlewares/authApi");

const router = new Router();

router.get("/posts", apiAuthenticated, adminController.posts);

router.post("/add-post", apiAuthenticated, adminController.addingPost);

router.get("/edit-post/:id", apiAuthenticated, adminController.editPost);

router.put("/edit-post/:id", apiAuthenticated, adminController.editingPost);

router.delete("/del-post/:id", apiAuthenticated, adminController.delPost);

// router.get("/:id", adminController.post);

module.exports = router;
