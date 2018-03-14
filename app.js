var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session')
var MongoDBStore = require('connect-mongodb-session')(session);
var path = require('path');
var app = express();


// load up the user model
var User= require('./models/users');

// include routes
var routes = require('./routes/routes');

// load the auth variables
var configAuth = require('./config/auth');

//connect to MongoDB
mongoose.connect('mongodb://localhost/googleApp');

var db = mongoose.connection;
    //handle mongo error
    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', () => {
     // console.log("Connect to Database..");
 });

//app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(passport.initialize()); // Init passport authentication
app.use(passport.session()); // persistent login sessions
app.use('/', routes);

//session
app.use(session({
    secret: 'secret',
    path: '/',
    cookie: {
         maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
        //expires: new Date(Date.now() + (30 * 86400 * 1000))
        //touchAfter: 24 * 3600 // time period in seconds
        },
    resave: true,
    saveUninitialized: true,
    store: new MongoDBStore({
    mongooseConnection: db
    })
  }));

    // used to serialize the user for the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser((id, done) => {
        User.findById(id,(err, user) => {
            done(err, user);
        });
    });

    //for GoogleStrategy
    passport.use(new GoogleStrategy({

          clientID        : configAuth.googleAuth.clientID,
          clientSecret    : configAuth.googleAuth.clientSecret,
          callbackURL     : configAuth.googleAuth.callbackURL,

      },(token, refreshToken, profile, done) => {

          // make the code asynchronous
          // User.findOne won't fire until we have all our data back from Google
          process.nextTick(() => {

              // try to find the user based on their google id
              User.findOne({ 'google.id' : profile.id }, (err, user) => {
                  if (err)
                      return done(err);

                  if (user) {
                      // if a user is found, log them in
                      return done(null, user);
                  } else {
                      // if the user isnt in our database, create a new user
                      var newUser= new User();

                      // set all of the relevant information
                      newUser.google.id    = profile.id;
                      newUser.google.token = token;
                      newUser.google.name  = profile.displayName;
                      newUser.google.email = profile.emails[0].value;

                      // save the user
                      newUser.save(function(err) {
                          if (err)
                              throw err;
                          return done(null, newUser);
                      });
                    }
              });
          });
    }));



app.set('port', process.env.PORT || 8080);

app.listen(app.get('port'), function() {
  //console.log('Server Starting on port ' + app.get('port'));
  console.log('Server Starting on : http://localhost:8080');
});