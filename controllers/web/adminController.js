const fs = require("fs");

const sharp = require("sharp");
const shortId = require("shortid");
const appRoot = require("app-root-path");

const Post = require("../../models/Post");
const { get404, get500 } = require("./errorController");

exports.dashboard = (req, res) => {
    res.render("admin/dashboard", {
        pageTitle: "Dashboard",
        path: "/dashboard",
    });
};

exports.posts = async (req, res) => {
    try {
        const posts = await Post.find().populate("user");
        res.render("admin/posts", {
            pageTitle: "Posts",
            path: "/posts",
            posts,
        });
    } catch (err) {
        console.log(err);
        get500(req, res);
    }
};

exports.addPost = (req, res) => {
    res.render("admin/add-post", { pageTitle: "add-post", path: "/add-post" });
};

exports.addingPost = async (req, res) => {
    const errors = [];
    const thumbnail = req.files ? req.files.thumbnail : {};
    const fileName = `${shortId.generate()}_${thumbnail.name}`;
    const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;
    try {
        req.body = { ...req.body, thumbnail };
        await Post.postValidation(req.body);
        await sharp(thumbnail.data)
            .jpeg({ quality: 60 })
            .toFile(uploadPath)
            .catch((err) => console.log(err));
        await Post.create({
            ...req.body,
            user: req.user.id,
            thumbnail: fileName,
        });
        return res.redirect("/dashboard/posts");
    } catch (err) {
        console.log(err);
        err.inner.forEach((e) => {
            errors.push({
                name: e.path,
                message: e.message,
            });
        });
        res.render("admin/add-post", {
            pageTitle: "add-post",
            path: "/add-post",
            errors,
        });
    }
};
exports.editPost = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id });

        res.render("admin/edit-post", {
            pageTitle: post.title,
            path: "/edit-post",
            post,
        });
    } catch (err) {
        console.log(err);
        get500(req, res);
    }
};

exports.editingPost = async (req, res) => {
    const errors = [];
    const thumbnail = req.files ? req.files.thumbnail : {};
    const fileName = `${shortId.generate()}_${thumbnail.name}`;
    const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;

    const post = await Post.findOne({ _id: req.params.id });
    try {
        if (thumbnail.name) {
            await Post.postValidation({ ...req.body, thumbnail });
        } else {
            await Post.postValidation({
                ...req.body,
                thumbnail: {
                    name: "placeholder",
                    size: 0,
                    mimetype: "image/jpeg",
                },
            });
        }
        if (thumbnail.name) {
            fs.unlink(
                `${appRoot}/public/uploads/thumbnails/${post.thumbnail}`,
                async (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        await sharp(thumbnail.data)
                            .jpeg({ quality: 60 })
                            .toFile(uploadPath)
                            .catch((err) => console.log(err));
                    }
                }
            );
        }
        const { title, status, body } = req.body;
        post.title = title;
        post.status = status;
        post.body = body;
        post.thumbnail = thumbnail.name ? fileName : post.thumbnail

        await post.save();
        return res.redirect("/dashboard/posts");
    } catch (err) {
        err.inner.forEach((e) => {
            errors.push({
                name: e.path,
                message: e.message,
            });
        });
        res.render("admin/edit-post", {
            pageTitle: "edit-post",
            path: "/edit-post",
            errors,
            post,
        });
    }
};
exports.delPost = async (req, res) => {
    try {
        const post = await Post.findByIdAndRemove(req.params.id);
        res.redirect("/dashboard/posts");
    } catch (err) {
        res.render("500");
        console.log(err);
    }
};
