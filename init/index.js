require('dotenv').config()

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")
const Reviews=require("../models/review.js")
const User = require("../models/user.js")

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
    await Reviews.deleteMany({});
   initData.data= initData.data.map((obj)=>({...obj, owner:"690c97d9d44331108f587bb0"}))
    await Listing.insertMany(initData.data);
    console.log("Your data has been initialised");
}
initDB();