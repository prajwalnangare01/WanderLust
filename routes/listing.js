const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const listing = require('../models/listing.js');
const {isLoggedin} = require('../middleware.js');
const {isOwner} = require('../middleware.js');
const {validateListing} = require('../middleware.js');
const listingcontroller = require('../controllers/listings.js');
const multer = require('multer');
const {storage} = require('../cloudconfig.js');
const upload = multer({storage});


router.route('/')
.get(wrapAsync(listingcontroller.index))
.post(isLoggedin, validateListing, upload.single("listing[image]"), wrapAsync(listingcontroller.createListing));

// New 
router.get('/new',isLoggedin, listingcontroller.renderNewForm);

router.route('/:id')
.get(wrapAsync(listingcontroller.showListing))
.put(isLoggedin, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingcontroller.updateListing))
.delete(isLoggedin, isOwner, wrapAsync(listingcontroller.destroyListing));

//Edit 
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(listingcontroller.renderEditForm));


module.exports = router;