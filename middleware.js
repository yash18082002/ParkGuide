const Park = require('./models/park');
const Review = require('./models/reviews');
const { parkSchema, reviewSchema } = require('./schemas');
const PGError = require('./util/PGError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Sign in to continue.');
        return res.redirect('/login');
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const authCheck = await Review.findById(reviewId);
    if (!authCheck.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/parks/${id}`);
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const authCheck = await Park.findById(id);
    if (!authCheck.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/parks/${id}`);
    }
    next();
}
module.exports.validatePark = (req, res, next) => {
    const { err } = parkSchema.validate(req.body);
    if (err) {
        const msg = err.details.map(el => el.message).join(', ');
        throw new PGError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { err } = reviewSchema.validate(req.body);
    if (err) {
        const msg = err.details.map(el => el.message).join(', ');
        throw new PGError(msg, 400);
    } else {
        next();
    }
}