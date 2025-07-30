require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressEroor');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// Route files
const campgroundRoutes = require('./routers/campground');
const reviewRoutes = require('./routers/reviews');
const userRoutes = require('./routers/user');

// 📦 Connect to MongoDB Atlas using .env variable


mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB:", mongoose.connection.name); // should log 'yelp-app'
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });



const app = express();

// Set up EJS and views
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session config
const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};
app.use(session(sessionConfig));
app.use(flash());

// Passport config
app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

// Home route
app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/test-user', (req, res) => {
  res.send('hello');
});

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('alert', { err });
});

// Start the server
app.listen(8080, () => {
  console.log('🚀 Server is running on port 8080');
});
