const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { schema } = require("./validators/userValidator");

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        minlength: 4,
        maxlength: 64,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 256
    },
    admin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

userSchema.statics.userValidation = function (body) {
    return schema.validate(body, { abortEarly: false });
};

userSchema.pre("save", function (next) {
    let user = this;

    if (!user.isModified("password")) return next();

    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) return next(err);

        user.password = hash;
        next();
    });
});

module.exports = mongoose.model("User", userSchema);
