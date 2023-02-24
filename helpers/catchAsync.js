const catchAsync = (fn) => {
    return async (req, res, next) => {
        await fn(req, res, next).catch(next)
    }
}

module.exports = catchAsync