
const listing = require('../models/listing.js');
const review = require('../models/review.js');

module.exports.createReview = async(req, res) => {
    let foundListing = await listing.findById(req.params.id); 
    let newReview = new review(req.body.review); 
    newReview.author = req.user._id; 
    await newReview.save(); 
    foundListing.reviews.push(newReview); 
    await foundListing.save(); 
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${foundListing._id}`);
    return; 
}

module.exports.destroyReview = async(req, res) => {
    let {id, reviewId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
    return; 
}