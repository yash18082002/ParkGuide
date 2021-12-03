const mongoose = require('mongoose');
const Park = require('../models/park');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: 'pk.eyJ1IjoieWFzaDE4MDgyMDAyIiwiYSI6ImNrd2V3YXNkODA4dHAycW11dWJtbzZ1NnIifQ.SL4WDI_AY7k-LhJz02lBFA' });

mongoose.connect('mongodb://localhost:27017/park-guide', {
    useNewUrlParser: true,
    /*useCreateIndex: true,*/
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database Connected');
});
const random = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Park.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1221 = Math.floor(Math.random() * 1221);
        const park = new Park({
            location: `${cities[random1221].name}, ${cities[random1221].state}`,
            title: `${random(descriptors)} ${random(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dmmquegdw/image/upload/v1637661650/sample.jpg',
                    filename: 'sample'
                }
            ],
            geometry: {
                type: "Point",
                coordinates: [85.8245, 20.2961]
            },
            description: "Seed Data : Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae labore sint dolore nihil. Eaque hic expedita explicabo! Natus id veritatis atque placeat voluptates officiis nemo voluptas ipsa? Cupiditate, officiis aliquam.",
            price: 49,
            author: "6198fc77222f3474b891fd7d"
        })
        const geoData = await geocoder.forwardGeocode({
            query: park.location,
            limit: 1
        }).send()
        park.geometry = geoData.body.features[0].geometry;
        await park.save();
    }
}
seedDB()
    .then(() => {
        mongoose.connection.close();
    })