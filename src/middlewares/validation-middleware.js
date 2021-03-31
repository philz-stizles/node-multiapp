exports.fileValidationMiddleware = (req, res, next) => {
    console.log(req.headers)
    console.log(req.file)
    console.log(req.files)
    console.log(req.body.file)
    console.log(req.body.files)
    next()
}