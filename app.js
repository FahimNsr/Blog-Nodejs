const path = require("path");

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const passport = require("passport");
const dotEnv = require("dotenv");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const i18n = require("i18n");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/db");
const { setHeaders } = require("./middlewares/headers");
const { apiErrorHandler } = require("./middlewares/apiErrorHandler");
// Load Config
dotEnv.config({ path: ".env" });

// Database connection
connectDB();

// Passport Config
require("./config/passport");

const app = express();

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(setHeaders);

// View Engine
app.use(expressLayout);
app.set("view engine", "ejs");
app.set("layout", "./layouts/homeLayout");
app.set("views", "views");

// File Upload
app.use(fileUpload());

// Session
app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        unset: "destroy",
        store: new MongoStore({ mongoUrl: process.env.MONGO_URI }),
    })
);
// Cookie
app.use(cookieParser("wwdffffff"));

// Passport
app.use(passport.initialize());
app.use(passport.session());

i18n.configure({
    locales: ["en", "de"],
    directory: path.resolve("./views/lang"),
    defaultlocale: "en",
    cookie: "lang",
    objectNotation: true,
});
app.use(i18n.init);

app.use((req, res, next) => {
    app.locals = {
        req,
    };
    next();
});

// Flash
app.use(flash());

// Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Web Routes
app.use(require("./routes/web/homeRoutes"));
app.use(require("./routes/web/authRoutes"));
app.use("/posts", require("./routes/web/postRoutes"));
app.use("/dashboard", require("./routes/web/adminRoutes"));

// Api Routes
// app.use(require("./routes/api/homeRoutes"));
app.use("/api", require("./routes/api/homeRoutes"));
app.use("/api", require("./routes/api/authRoutes"));
app.use("/api/posts", require("./routes/api/postRoutes"));
app.use("/api/dashboard", require("./routes/api/adminRoutes"));

app.use(apiErrorHandler);

// 404 Page
app.use(require("./controllers/web/errorController").get404);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);
