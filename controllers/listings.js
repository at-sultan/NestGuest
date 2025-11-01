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


module.exports.createListing = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    console.log(req.user._id)
    console.log(req.user)
    newListing.image = {url, filename}

        // Geocode the address to get coordinates
    const fullAddress = `${req.body.listing.location}, ${req.body.listing.country}`;
        const geocoded = await geocodeAddress(fullAddress);
        
        if (geocoded) {
            newListing.latitude = geocoded.latitude;
            newListing.longitude = geocoded.longitude;
            console.log(`Geocoded coordinates: ${geocoded.latitude}, ${geocoded.longitude}`);
        } else {
            // Fallback coordinates (Delhi, India)
            newListing.latitude = 28.6139;
            newListing.longitude = 77.2090;
            console.log('Using default coordinates');
        }

    await newListing.save();
    req.flash("success", "new listing created!")
    res.redirect("/listings")

}

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



module.exports.updateListing = async (req,res)=>{
let {id} = req.params;
let listing = await Listing.findByIdAndUpdate((id), {...req.body.listing});

        // If location or country changed, re-geocode
        if (req.body.listing.location || req.body.listing.country) {
            const fullAddress = `${req.body.listing.location || listing.location}, ${req.body.listing.country || listing.country}`;
            const geocoded = await geocodeAddress(fullAddress);
            
            if (geocoded) {
                listing.latitude = geocoded.latitude;
                listing.longitude = geocoded.longitude;
                console.log(`Updated coordinates: ${geocoded.latitude}, ${geocoded.longitude}`);
            }
        }


if(typeof req.file !=="undefined"){
let url = req.file.path;
let filename = req.file.filename;
listing.image= {url, filename};
await listing.save();
}
req.flash("success", "listing updated!")
res.redirect(`/listings/${id}`)
}


module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
     req.flash("success", "listing deleted!")
    res.redirect("/listings");
   
}