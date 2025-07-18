const Review = require("../models/review.js");
const Campground = require("../models/campGround");

module.exports.newReview=async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
    review.author = req.user._id;
  campground.reviews.push(review);
    await review.save();
  await campground.save();
  console.log("Campground Reviews:", campground.reviews);
  req.flash("success", "Created new review!");
  res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview=async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review");
  res.redirect(`/campgrounds/${id}`);
}