const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken})

module.exports.index = async(req,res) =>{
    const alllisting = await Listing.find({});
     res.render('./listings/index.ejs', {alllisting});
}

module.exports.renderNewForm = async(req,res) =>{
    res.render('./listings/new.ejs');
}

module.exports.showListing = async(req,res) =>{
    const {id} = req.params;
    const findlistings = await Listing.findById(id).populate({path:'reviews', populate: {path: 'author'}}).populate('owner');
    if(!findlistings)
    {
        req.flash("error", "Listing Not Found");
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs', { findlistings });

}

module.exports.createListing = async(req, res, next) => {
    
    let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
    }).send()

    //let {title, description, image, price, location, country} = req.body;
    let url = req.file.path;
    let filename = req.file.filename;
    let listingdata = req.body.listing;
    let newListing = new Listing(listingdata);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect('/listings');
    return; 
}

module.exports.renderEditForm = async (req,res) =>{
        let {id} = req.params;
        let findlisting = await Listing.findById(id);
        let originalimg = findlisting.image.url;
        originalimg.replace("/upload", "/upload/w_250")
        res.render('./listings/edit.ejs', {findlisting});
}

module.exports.updateListing = async (req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let listingupdate = req.body.listing;
    await Listing.findByIdAndUpdate(id, { ...listingupdate });
    if(typeof req.file !== "undefined")
    {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
    return; 
}

module.exports.destroyListing = async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect('/listings');
    return;
}