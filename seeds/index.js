const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require('../models/campGround');

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-app")
  .then(() => {
    console.log("Successfully connected to MongoDB!");
  })
  .catch((err) => {
    console.log("Connection failed!");
    console.error(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 900; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const random = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author:'68720b40eca5d822c6c814ff',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
          geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
      image: "https://picsum.photos/200/300",
      price: random,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, quo. Quidemearum, natus obcaecati et id sunt iure odio suscipit quis necessitatibus fugaveritatis placeat laudantium fugiat sed sapiente incidunt!",
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
