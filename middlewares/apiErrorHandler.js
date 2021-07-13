exports.apiErrorHandler = (error, req ,res , next) => {
    const status = error.statusCode || 500
    const message = error.message
    const date = error.date
    res.status(status).json({message, date})
}