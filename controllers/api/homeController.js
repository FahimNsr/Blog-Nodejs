const Post = require("../../models/Post");

exports.home = async (req, res, next) => {
    try {
        const posts = await Post.find({ status: "public" })
            .sort({ createdAt: "desc" })
            .limit(3)

        res.status(200).json({ posts });
    } catch (err) {
        next(err);
    }
};
