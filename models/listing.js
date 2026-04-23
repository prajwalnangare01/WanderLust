const mongoose = require('mongoose');
const schema = mongoose.Schema;
const review = require('./review');

const defaultimg = 'https://cdn.pixabay.com/photo/2018/05/08/21/08/airbnb-3383930_1280.png'

const listingSchema = new schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: { 
        url: String,
        filename: String 
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: schema.Types.ObjectId,
        ref: 'review'
    }],
    owner: {
        type: schema.Types.ObjectId,
        ref: 'user'
    },
    geometry: {
        type: {
            type: String, // Dont do {geometry{type: String}}
            enum: ['Point'],
            required: true
        },
        coordinates:{
            type: [Number],
            required: true
        }
    },
    
})

listingSchema.post('findOneAndDelete', async (doc) => { 
    if(doc) { 
        await review.deleteMany({
        _id: {
            $in: doc.reviews 
        }
    })
    }
} )
const listing = mongoose.model("listing", listingSchema);

module.exports = listing;