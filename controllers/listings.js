const Listing = require("../models/listing")
const geocodeAddress = require('../utils/geocoder');


module.exports.index =  async (req, res)=>{
const allListings = await Listing.find({})
res.render("listings/index.ejs",{allListings})  
}


module.exports.renderNewForm = (req,res)=>{    
res.render("listings/new.ejs");
}

module.exports.showListings = async (req,res)=>{
let {id}= req.params;
const listing = await Listing.findById(id)
.populate({
path:"reviews",
populate:{
    path: "author",
 },
})
.populate("owner")
    
if(!listing){
   req.flash("error", "listing des not exist!")
   return res.redirect("/listings")
   }
res.render("listings/show.ejs",{listing})
   
}


module.exports.createListing = async (req, res, next) => {
    try {
        // Validate required fields
        const { location, country, title, price } = req.body.listing;
        
        if (!location || !country) {
            req.flash('error', 'Location and country are required');
            return res.redirect('/listings/new');
        }

        // Handle image upload
        let imageData = {};
        if (req.file) {
            imageData = {
                url: req.file.path,
                filename: req.file.filename
            };
        }

        // Create new listing
        const newListing = new Listing({
            ...req.body.listing,
            owner: req.user._id,
            image: imageData
        });

        // Geocode the address
        const fullAddress = `${location.trim()}, ${country.trim()}`;
        console.log(`Mobile geocoding: ${fullAddress}`);
        
        const geocoded = await geocodeAddress(fullAddress);
        
        if (geocoded && geocoded.latitude && geocoded.longitude) {
            newListing.latitude = geocoded.latitude;
            newListing.longitude = geocoded.longitude;
            console.log(`✅ Coordinates set: ${geocoded.latitude}, ${geocoded.longitude}`);
        } else {
            // Fallback to Delhi coordinates
            newListing.latitude = 28.6139;
            newListing.longitude = 77.2090;
            console.log('⚠️ Using default Delhi coordinates');
        }

        await newListing.save();
        req.flash("success", "New listing created!");
        res.redirect("/listings");

    } catch (error) {
        console.error('Create listing error:', error);
        req.flash('error', 'Failed to create listing');
        res.redirect('/listings/new');
    }
};
module.exports.renderEditForm = async(req,res)=>{
    let {id}= req.params;
   const listing = await Listing.findById(id);
 if(!listing){
   req.flash("error", "listing des not exist!")
   return res.redirect("/listings")
   }

   let originalImageUrl = listing.image.url;
   originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_200")
   res.render("listings/edit.ejs",{listing, originalImageUrl})
}



module.exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the listing first
        let listing = await Listing.findById(id);
        if (!listing) {
            req.flash('error', 'Listing not found');
            return res.redirect('/listings');
        }

        // Update basic fields
        listing.set(req.body.listing);

        // Check if location data changed
        const locationChanged = req.body.listing.location || req.body.listing.country;
        
        if (locationChanged) {
            const location = req.body.listing.location || listing.location;
            const country = req.body.listing.country || listing.country;
            const fullAddress = `${location}, ${country}`;
            
            console.log(`Updating location: ${fullAddress}`);
            
            const geocoded = await geocodeAddress(fullAddress);
            
            if (geocoded && geocoded.latitude && geocoded.longitude) {
                listing.latitude = geocoded.latitude;
                listing.longitude = geocoded.longitude;
                console.log(`✅ Updated coordinates: ${geocoded.latitude}, ${geocoded.longitude}`);
            } else {
                console.log('⚠️ Keeping existing coordinates');
            }
        }

        // Update image if new file uploaded
        if (req.file) {
            listing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }

        // Save all changes
        await listing.save();
        
        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);

    } catch (error) {
        console.error('Update listing error:', error);
        req.flash('error', 'Failed to update listing');
        res.redirect(`/listings/${id}/edit`);
    }
};

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
     req.flash("success", "listing deleted!")
    res.redirect("/listings");
   
}