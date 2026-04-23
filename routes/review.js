const express = require('express');
const router = express.Router( {mergeParams: true} );
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const review = require('../models/review.js');
const listing = require('../models/listing.js'); 
const {reviewSchema} = require('../schema.js');
const { isLoggedin } = require('../middleware.js');
const { isReviewAuthor } = require('../middleware.js');
const reviewcontroller = require('../controllers/reviews.js');


const validateReview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    if (result.error) {
        let errMsg = result.error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg)); // Corrected to use return next(err)
    }else{
        next();
    }
}

// Reviews
router.post('/',isLoggedin, validateReview, wrapAsync(reviewcontroller.createReview));

router.delete('/:reviewId',isLoggedin, isReviewAuthor, wrapAsync(reviewcontroller.destroyReview));

module.exports = router;