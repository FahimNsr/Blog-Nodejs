exports.get404 = (req, res) =>{
    res.render("404", { pageTitle: "Page not found | 404", path: "/404" });
}

exports.get500 = (req, res) =>{
    res.render("500", { pageTitle: "Internal Server Error | 500", path: "/500" });
}