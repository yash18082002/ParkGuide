const Review = require('../models/reviews');
const Park = require('../models/park');

module.exports.postReview = async (req, res) => {
    const park = await Park.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    park.reviews.push(review);
    await review.save();
    await park.save();
    req.flash('success', 'Review added successfully!');
    res.redirect(`/parks/${park._id}`, { page: 0 });
}

module.exports.deleteReview = async (req, res) => {
    const park = await Park.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Park deleted successfully!');
    res.redirect(`/parks/${park._id}`, { page: 0 });
}