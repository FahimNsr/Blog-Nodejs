const Post = require('../../models/Post');

const { get404, get500 } = require("./errorController");

exports.posts = async (req , res ) =>{
    try {
        const posts  = await Post.find({status : "public"}).sort( {createdAt : "desc"})
        res.render("post/posts", {
            pageTitle: "Posts",
            path: "/posts",
            posts,
        });
        
    } catch (err) {
        console.log(err)
        get500(req, res);
    }
}
exports.post = async (req , res ) =>{
    try {
        const post = await Post.findOne({ _id: req.params.id });
        res.render("post/post-details", {
            pageTitle: post.title,
            path: "/post-details",
            post,
        });
    } catch (err) {
        console.log(err)
        get500(req, res);
    }
}

