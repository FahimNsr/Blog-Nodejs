const Yup = require("yup");

exports.schema = Yup.object().shape({
    username: Yup.string().min(4).max(64),
    email: Yup.string().email().required(),
    password: Yup.string().min(4).max(256),
    confirmPassword: Yup.string()
        .required()
        .oneOf([Yup.ref("password"), null])
});
