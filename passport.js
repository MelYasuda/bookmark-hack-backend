const passport = require('passport');
const LocalStorategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const {User} = require('./models/user');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const config = require('config');

passport.use( new LocalStorategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function(email, password, cb){
    return User.findOne({email: email})
       .then( async user => {
           if (!user) {
               return cb('Incorrect email or password.', false);
           } else {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid) return cb('Incorrect email or password.', false);
           }
           return cb(null, user, {message: 'Logged In Successfully'});
      })
      .catch(err => cb(err));
  }));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey : config.get('jwtPrivateKey')
},
  (jtwPayload, cb) => {
    return User.findById({_id: jtwPayload._id})
      .then(user => {
        return cb(null,user);
      })
      .catch(err => {return cb(err)
      });
  }
));