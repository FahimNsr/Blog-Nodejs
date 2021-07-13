const { Router } = require("express");
const i18n = require('i18n')

const router = new Router();

router.get("/404", (req, res) => {
    res.render('404', {pageTitle : '404', path: "/404"});
});

router.use((req, res ,next) => {
    try {
        let lang = req.signedCookies.lang;
        if(i18n.getLocales().includes(lang)) 
            req.setLocale(lang)
        else 
            req.setLocale(i18n.getLocale());
        next();
    } catch (err) {
        next(err);
    }
})

router.get('/lang/:lang' , (req, res) => {
    let lang = req.params.lang;
    if(i18n.getLocales().includes(lang))
        res.cookie('lang' , lang , { maxAge : 1000 * 60  * 60 * 24 * 90 , signed : true})
        
    res.redirect(req.header('Referer') || '/');
})


router.get("/", (req, res) => {
    res.render("home/home" ,{ pageTitle: req.__("Homepage"), path: "/home" });
});


router.get("/products", (req, res) => {
    res.render("home/products", { pageTitle: "products", path: "/products" });
});


router.get("/cart", (req, res) => {
    res.render("home/cart", { pageTitle: "cart", path: "/cart" });
});

router.get("/checkout", (req, res) => {
    res.render("home/checkout", { pageTitle: "checkout", path: "/checkout" });
});

router.get("/profile", (req, res) => {
    res.render("home/profile", { pageTitle: "profile", path: "/profile" });
});

router.get("/about", (req, res) => {
    res.render("home/about", { pageTitle: "about", path: "/about" });
});
router.get("/contact", (req, res) => {
    res.render("home/contact", { pageTitle: "contact", path: "/contact" });
});

module.exports = router;
