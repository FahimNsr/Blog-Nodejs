const { Router } = require("express");

const { authenticated } = require("../../middlewares/auth");
const adminController = require("../../controllers/web/adminController");

const router = new Router();

router.use((req, res, next) => {
    res.locals.layout = "layouts/adminLayout.ejs";
    next();
});

router.get("/", authenticated, adminController.dashboard);
router.get("/posts", authenticated, adminController.posts);
router.get("/add-post", authenticated, adminController.addPost);
router.post("/add-post", authenticated, adminController.addingPost);
router.get("/edit-post/:id", authenticated, adminController.editPost);
router.post("/edit-post/:id", authenticated, adminController.editingPost);
router.get("/del-post/:id", authenticated, adminController.delPost);

module.exports = router;
