
const express = require('express');
const passport = require('passport');
const path = require('path');
const proxy = require('http-proxy-middleware');
const auth = require('./auth');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Create a new Express application.
const app = express();
app.set('port', process.env.PORT || 3001);

// Configure view engine to render EJS templates.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: '104106592556-2su2esio186qnbv6bcrt5tqcpo7ha4ud.apps.googleusercontent.com',
    clientSecret: 'lHfhXW1ele0usmuddghaut1V',
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('tiny'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());

// Store authentication state, if any, in the session
app.use(passport.session());

// Used when we create a client/build for production
app.use('/static', express.static(path.join(__dirname, '..', 'client', 'build', 'static')));

//
// This server
//
app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

// app.get('/login', (req, res) => {
//   res.render('login');
// });
//
// app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect('/');
// });

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/profile', auth.ensureLoggedIn, (req, res) => {
  res.render('profile', { user: req.user });
});

app.get('/api/user', auth.ensureLoggedIn, (req, res) => {
  res.json({ user: req.user });
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });


//
// create-react-app development server (or built assets)
//

if (process.env.NODE_ENV !== 'production') {
  // We start a proxy to the create-react-app dev server
  const apiProxy = proxy('/', { target: 'http://localhost:3000', ws: true });
  app.use(apiProxy);
} else {
  // When in production
  // All url paths go to the bundled index.html
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

// Handle errors
// app.use((err, req, res, next) => {
//   if (res.headersSent) {
//     return next(err);
//   }
//   console.log(err);
//   return res.status(err.status || 500).send('500 Server Error');
// });

// Start server
app.listen(app.get('port'), () => {
  console.log('App listening on port', app.get('port'));
});
