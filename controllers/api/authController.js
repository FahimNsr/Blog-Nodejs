const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const bcrypt = require("bcryptjs");

exports.registerProcess = async (req, res, next) => {
    try {
        await User.userValidation(req.body);
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            const error = new Error ("Email address is already in use")
            error.statusCode = 422
            throw error
        } else {
            await User.create({ email, password });
            res.status(201).json({ message : "Registration was successful"})
        }
    } catch (err) {
        next(err)
        console.log(err)
    }
};


exports.loginProcess = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("We cannot find an account with this e-mail address");
            error.statusCode = 404;
            throw error;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign(
                {
                    user: {
                        userId: user._id.toString(),
                        email: user.email,
                        admin: user.admin
                    },
                },
                process.env.JWT_SECRET
            );
            res.status(200).json({ token, userId: user._id.toString() });
        } else {
            const error = new Error("E-mail or password is incorrect");
            error.statusCode = 422;
            throw error;
        }
    } catch (err) {
        next(err);
    }
};


exports.logout = (req, res, next) => {
    req.session = null
    req.logout();
    res.redirect("/");
};
