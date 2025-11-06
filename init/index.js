require('dotenv').config()

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")
const Reviews=require("../models/review.js")

//local db connection
// const MONGO_URL= 

//const atlasurl=
main()
.then(()=>{
    console.log("Connected to DB")
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(atlasurl);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    await Reviews.deleteMany({})
   initData.data= initData.data.map((obj)=>({...obj, owner:"6905a834d56c4f0be071f314"}))
    await Listing.insertMany(initData.data);
    console.log("Your data has been initialised");
}
initDB();