const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const campGround = require("../models/campGround");
const methodOverride = require('method-override');
const ExpressError = require('../utils/ExpressEroor');
const { isLoggedIn } = require('../middleware'); 
const campgrounds=require('../controller/campgrounds')

// GET all campgrounds
router.get("/",campgrounds.index);

// Form to create new campground
router.get("/new",isLoggedIn,campgrounds.new);

// CREATE campground
router.post("/", isLoggedIn,wrapAsync(campgrounds.create));

// SHOW campground
router.get("/:id", wrapAsync(campgrounds.show));

// EDIT form
router.get('/:id/edit', isLoggedIn, campgrounds.edit);

// UPDATE campground
router.put('/:id', isLoggedIn, wrapAsync(campgrounds.update));

// DELETE campground
router.delete('/:id', isLoggedIn,campgrounds.delete);

module.exports = router;
