const express=require('express');
const router=express.Router({mergeParams:true});
const Campground=require("../models/campground.js");
const catchAsync=require("../utils/catchAsync.js");
const reviews=require("../controllers/reviews.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const {validatReview,isLoggedIn,isReviewAuthor}=require('../middleware.js');

router.post("/",isLoggedIn,validatReview,catchAsync(reviews.createReview));
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,reviews.deleteReview);
module.exports=router;