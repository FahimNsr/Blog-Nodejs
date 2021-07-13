const Post = require("../../models/Post");

exports.posts = async (req, res, next) => {
    try {
        const postsCount = await Post.find({
            status: "public",
        }).countDocuments();
        const posts = await Post.find({ status: "public" }).sort({
            createdAt: "desc",
        });

        res.status(200).json({ posts, postsCount });
    } catch (err) {
        next(err);
    }
};
exports.post = async (req, res, next) => {
    try {
        const post = await Post.findOne({ _id: req.params.id }).populate(
            "user"
        );
        if (!post) {
            const error = new Error("There is no post with this ID");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ post });
    } catch (err) {
        next(err);
    }
};
