const express=require('express');
const router=express.Router();
const catchAsync=require("../utils/catchAsync.js");
const Campground=require("../models/campground.js");
const campgrounds=require("../controllers/campground.js");
const multer  = require('multer')
const {storage}=require('../cloudinary/index.js');
const upload = multer({storage})
const {isLoggedIn,isAuthor,validateCampground}=require('../middleware.js');
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampgrounds));
router.get("/new",isLoggedIn,campgrounds.renderNewForm);
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,catchAsync(campgrounds.deleteCampground));
router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm))
module.exports=router;