const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const campGround = require("../models/campGround");
const methodOverride = require('method-override');
const ExpressError = require('../utils/ExpressEroor');
const { isLoggedIn } = require('../middleware'); 
const campgrounds=require('../controller/campgrounds')


router.get("/",campgrounds.index);


router.get("/new",isLoggedIn,campgrounds.new);


router.post("/", isLoggedIn,wrapAsync(campgrounds.create));

router.get("/:id", wrapAsync(campgrounds.show));

router.get('/:id/edit', isLoggedIn, campgrounds.edit);

router.put('/:id', isLoggedIn, wrapAsync(campgrounds.update));

router.delete('/:id', isLoggedIn,campgrounds.delete);

module.exports = router;
