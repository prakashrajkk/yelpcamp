const mongoose=require('mongoose');
const Review = require('./review');

const Schema=mongoose.Schema;


const campGroundSchema=new Schema({
    title:String,
    price:Number,
    image:String,
geometry: {
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required:true
  }
},

    description:String,
    location:String,
    author:{
        type:mongoose.Schema.Types.ObjectId, ref:'User'
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId , ref:'Review'
    }]
})
module.exports=mongoose.model('Campground',campGroundSchema);