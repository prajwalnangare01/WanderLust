const listing = require('./models/listing.js');
const review = require('./models/review.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema } = require('./schema.js');


module.exports.isLoggedin = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be signed in");
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let foundListing = await listing.findById(id);
    if(!foundListing.owner._id.equals(req.user._id)){
        req.flash("error" , "You don't have permission to do that");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
     let result = listingSchema.validate(req.body);
     if (result.error) {
        let errMsg = result.error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg)); 
     }else{
        next();
     }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let foundReview = await review.findById(reviewId);
    if(!foundReview.author.equals(req.user._id)){
        req.flash("error" , "You don't have permission to do that");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
