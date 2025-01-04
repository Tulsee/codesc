import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import User from '../models/User.model.js';


export default function configurePassport(passportInstance) {
    passportInstance.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        function (accessToken, refreshToken, profile, cb) {
            const newUser = {
                name: profile.displayName,
                email: profile.emails[0].value,
                profile_image: profile._json.picture,
                password: profile.id
            };

            User.findOne({email: newUser.email}).then(user => {
                if (user) {
                    cb(null, user);
                } else {
                    new User(newUser).save().then(user => {
                        cb(null, user);
                    });
                }
            });
        }));

    passportInstance.serializeUser((user, done) => {
        done(null, user.id);
    });

    passportInstance.deserializeUser((id, done) => {
        User.findById(id).then(user => done(null, user));
    });
}