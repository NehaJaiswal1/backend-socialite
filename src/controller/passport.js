const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
require("dotenv").config(); 
const GitHubStrategy = require("passport-github2").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;

passport.use(
  new FacebookStrategy(
    {
      clientID: '1462946945093819',
      clientSecret: '7973bf8a3e219d4081db44103dc4df22',
      callbackURL: "http://localhost:3001/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      // Placeholder for database save
      return done(null, profile);
    }
  )
);




passport.use(
  new GitHubStrategy(
    {
      clientID: 'Ov23liwfeForkT4sqei6',
      clientSecret: 'yd1fd5b6f9ffa1046d272a7d03b29b3d187f62bc1',
      callbackURL: "http://localhost:3001/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Here, you can save the user to the database if needed
      return done(null, profile);
    }
  )
);

passport.use(
  new TwitterStrategy(
    {
      consumerKey: 'hty0hFx3LeywK7oGZHLuTuLle',
      consumerSecret: 'c70Npafn2GL9kyzUkkEaNkY5dirN3pmY0es0rTGXwwEc0i4g5j',
      callbackURL: "http://localhost:3001/auth/twitter/callback",
    },
    (token, tokenSecret, profile, done) => {
      // Here, handle the profile information or save it to the database if needed
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
