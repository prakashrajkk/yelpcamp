const express = require("express");
const router = express.Router({ mergeParams: true });

const Campground = require("../models/campGround.js");
const Review = require("../models/review.js");
const {isLoggedIn}=require('../middleware')
const ExpressError = require("../utils/ExpressEroor.js");
const reviews=require('../controller/reviews.js')

router.post("/", isLoggedIn,reviews.newReview);

router.delete("/:reviewId", isLoggedIn,reviews.deleteReview);

module.exports = router;
