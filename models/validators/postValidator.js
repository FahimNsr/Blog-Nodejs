const Yup = require("yup");

exports.schema = Yup.object().shape({
    title: Yup.string().min(8).max(64),
    body: Yup.string().required(),
    status: Yup.mixed().oneOf(["private", "public"]),
    thumbnail: Yup.object().shape({
        name: Yup.string().required(),
        size: Yup.number().max(3000000),
        MimeType: Yup.mixed().oneOf(["image/jpg", "image/png"]),
    }),
});
