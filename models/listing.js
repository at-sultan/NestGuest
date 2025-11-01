const mongoose = require("mongoose");
const Review= require("./review.js")
const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title:{ 
        type:String,
        required:true,
    },
    description: String,
    image: {
        url:String,
        filename:String,
       
    },
    price:Number,
        
    location:String,
    country: String,
    latitude: {
        type: Number,
        default: 28.6139 // Default to Delhi
    },
    longitude: {
        type: Number,
        default: 77.2090 // Default to Delhi
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },

})
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:  {$in:listing.reviews}})
    }
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

