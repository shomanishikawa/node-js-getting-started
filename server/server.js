
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

passport.use(new GoogleStrategy({
    clientID: '104106592556-2su2esio186qnbv6bcrt5tqcpo7ha4ud.apps.googleusercontent.com',
    clientSecret: 'lHfhXW1ele0usmuddghaut1V',
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

app.use(require('morgan')('tiny'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/static', express.static(path.join(__dirname, '..', 'client', 'build', 'static')));


app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

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

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/home');
  });


if (process.env.NODE_ENV !== 'production') {
  const apiProxy = proxy('/', { target: 'http://localhost:3000', ws: true });
  app.use(apiProxy);
} else {
  app.get('/*', auth.ensureLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

app.listen(app.get('port'), () => {
  console.log('App listening on port', app.get('port'));
});
