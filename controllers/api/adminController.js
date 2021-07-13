const fs = require("fs");

const sharp = require("sharp");
const shortId = require("shortid");
const appRoot = require("app-root-path");

const Post = require("../../models/Post");

exports.posts = async (req, res, next) => {
    try {
        const postsCount = await Post.find({
            status: "public",
        }).countDocuments();
        const posts = await Post.find().populate({
            path: "user",
            select: "email",
        });

        res.status(200).json({ posts, postsCount });
    } catch (err) {
        next(err);
    }
};

exports.addingPost = async (req, res, next) => {
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
            user: req.userId,
            thumbnail: fileName,
        });
        res.status(201).json({ message: "New Post added successfully" });
    } catch (err) {
        next(err);
        console.log(err)
    }
};
exports.editPost = async (req, res) => {
    try {
        const editPost = await Post.findOne({ _id: req.params.id });
        if (!post) {
            const error = new Error("There is no post with this ID");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ editPost });
    } catch (err) {
        next(err);
    }
};

exports.editingPost = async (req, res) => {
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
        if (!post) {
            const error = new Error("There is no post with this ID");
            error.statusCode = 404;
            throw error;
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
        post.thumbnail = thumbnail.name ? fileName : post.thumbnail;

        await post.save();

        res.status(200).json({ message: "Post edited successfully" });
    } catch (err) {
        next(err);
    }
};
exports.delPost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndRemove(req.params.id);
        fs.unlink(
            `${appRoot}/public/uploads/thumbnails/${post.thumbnail}`,
            (err) => {
                if (err) {
                    const error = new Error("somthing went wrong in delete thumbnail");
                    error.statusCode = 400;
                    throw error;
                } else {
                    res.status(200).json({
                        message: "Post deleted successfully",
                    });
                }
            }
        );
    } catch (err) {
        next(err);
    }
};
