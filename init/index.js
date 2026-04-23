const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});
const mongoose = require('mongoose');
const initdata = require('./data');
const listing = require('../models/listing');
const mongo_uri = process.env.ATLASDB_URL || "mongodb://localhost:27017/wanderlust";

main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(mongo_uri);
}

const initDB = async () => {
    await listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj, owner:"69e901fefe107d65a273b9ca", geometry: { type: "Point", coordinates: [0, 0] }}));
    await listing.insertMany(initdata.data);
    console.log("Database initialized");
}

initDB();

module.exports = initDB;