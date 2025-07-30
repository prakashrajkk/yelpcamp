require('dotenv').config();
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campGround');

// Connect to MongoDB Atlas
mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas (Seeding)");
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error (Seeding):");
    console.error(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 900; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const randomPrice = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '68720b40eca5d822c6c814ff', // use valid ObjectId
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude
        ]
      },
      image: 'https://picsum.photos/400/300',
      price: randomPrice,
      description: 'A beautiful campground with stunning views and great amenities.'
    });
    await camp.save();
  }
};

seedDB().then(() => {
  console.log('✅ Database seeded successfully!');
  mongoose.connection.close();
});
