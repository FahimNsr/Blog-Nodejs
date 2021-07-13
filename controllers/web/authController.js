const passport = require("passport");
const fetch = require("node-fetch");

const User = require("../../models/User");

exports.register = async (req, res) => {
  res.render("auth/register", {
    pageTitle: "Register",
    path: "/register",
  });
};

exports.registerProcess = async (req, res) => {
  const errors = [];
  try {
    await User.userValidation(req.body);
    const { email, password } = req.body;

    const firstUser = await User.findOne({});
    const user = await User.findOne({ email });

    if (user) {
      errors.push({ message: req.__("Email address is already in use") });
      return res.render("auth/register", {
        pageTitle: "Register",
        path: "/register",
        errors,
      });
    }

    if (firstUser) {
      await User.create({ email, password });
    } else {
      await User.create({ email, password, admin: true }); 
    }

    req.flash("seccessMessage", req.__("Registration was successful"));
    res.redirect("/login");
  } catch (err) {
    err.inner.forEach((e) => {
      errors.push({
        name: e.path,
        message: e.message,
      });
    });

    return res.render("auth/register", {
      pageTitle: "Register",
      path: "/register",
      errors,
    });
  }
};

exports.login = (req, res) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    message: req.flash("seccessMessage"),
    error: req.flash("error"),
  });
};

exports.loginProcess = async (req, res, next) => {
  if (!req.body["g-recaptcha-response"]) {
    req.flash("error", req.__("Please check reCAPTCHA"));
    return res.redirect("/login");
  }
  const secretKey = process.env.CAPTCHA_SECRET_KEY;
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body["g-recaptcha-response"]}
    &remoteip=${req.connection.remoteAddress}`;

  const response = await fetch(verifyUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    },
  });
  const json = await response.json();
  if (json.success) {
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res, next);
  } else {
    req.flash("error", "somthing went wrong in reCAPTCHA");
    res.redirect("/login");
  }
};

exports.rememberMe = (req, res) => {
  if (req.body.remember) {
    req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000; // 1 days
  } else {
    req.session.cookie.expire = null;
  }
  res.redirect("/");
};

exports.logout = (req, res, next) => {
  req.session = null;
  req.logout();
  res.redirect("/");
};
