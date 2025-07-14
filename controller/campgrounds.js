
const campGround = require("../models/campGround");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY; 

module.exports.index = async (req, res) => {
  const campgrounds = await campGround.find();

  const campgroundsGeoJSON = {
    type: "FeatureCollection",
    features: campgrounds.map(camp => ({
      type: "Feature",
      geometry: camp.geometry,
      properties: {
        id: camp._id,
        title: camp.title,
        location: camp.location,
        popUpMarkup: `<strong><a href="/campgrounds/${camp._id}">${camp.title}</a></strong><p>${camp.location}</p>`
      }
    }))
  };

  res.render("campgrounds", {
    campgrounds,
    campgroundsGeoJSON,
    maptilerKey: process.env.MAPTILER_API_KEY // ✅ this was missing
  });
};



module.exports.new=(req, res) => {
  res.render("new");
}

module.exports.create = async (req, res, next) => {
  try {
    console.log("API KEY:", process.env.MAPTILER_API_KEY);

    // Get location from form
    const geoData = await maptilerClient.geocoding.forward(req.body.location, { limit: 1 });

    // Create new campground manually from flat request body
    const campground = new campGround({
      title: req.body.title,
      location: req.body.location,
      image: req.body.image,
      price: req.body.price,
      description: req.body.description,
      geometry: geoData.features[0].geometry,
      author: req.user._id
    });

    await campground.save();
    // console.log(campground);
    req.flash('success', 'Successfully added new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (e) {
    next(e);
  }
};

module.exports.show = async (req, res) => {
  const { id } = req.params;
  const campground = await campGround.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author'
      }
    })
    .populate('author');
  
  if (!campground) {
    req.flash('error', 'Oops! No such campground exists.');
    return res.redirect('/campgrounds');
  }

  res.render('show', {
    campground, // ✅ send campground data
    maptilerKey: process.env.MAPTILER_API_KEY // ✅ also send your API key
  });
};


module.exports.edit=async (req, res) => {
  const { id } = req.params;
    const campground = await campGround.findById(id);
  res.render('edit', { campground });
}

module.exports.update=(async (req, res) => {
  const { id } = req.params;
   const campground=await campGround.findById(id);
   if(! campground.author.equals(req.user._id))
   {
      req.flash('error','You Dont Have permission to Update the campground');
      return res.redirect(`/campgrounds/${campground._id}`);
   }

  await campGround.findByIdAndUpdate(id, req.body);
  req.flash('success', 'successfully edited campground');
  res.redirect('/campgrounds');
})

module.exports.delete=async (req, res) => {
  const { id } = req.params;
    const campground=await campGround.findById(id);
   if(! campground.author.equals(req.user._id))
   {
      req.flash('error','You Dont Have permission to Update the campground');
      return res.redirect(`/campgrounds/${campground._id}`);
   }
  await campGround.findByIdAndDelete(id);
  req.flash('success', 'successfully deleted campground');
  res.redirect('/campgrounds');
}