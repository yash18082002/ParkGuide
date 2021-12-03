const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../util/catchAsync');
const Review = require('../models/reviews');
const Park = require('../models/park');
const reviewController = require('../controllers/reviews');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.postReview));
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview));

module.exports = router;