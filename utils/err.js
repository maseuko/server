exports.err = (err) => {
    if(err.statusCode){
        return next(err);
    }
    const error = new Error("Something went wrong.");
    next(error);
}