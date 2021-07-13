const mongoose = require("mongoose");

const { schema } = require("./validators/postValidator");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        minlength: 8,
        maxlength: 64,
    },
    body: {
        type: String,
        require: true,
    },
    thumbnail: {
        type: String,
        require: true
    },
    status: {
        type: String,
        default: "private",
        enum: ["private", "public"]},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

postSchema.statics.postValidation = function (body) {
    return schema.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("Post", postSchema);
