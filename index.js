import express from 'express';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import passport from 'passport';
import session from 'express-session';

import AuthRoute from "./routes/auth.route.js";
import PostRoute from "./routes/post.route.js";
import configurePassport from './config/passport.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {connectTimeoutMS: 20000}).then(() => {
    console.log("MongoDB Connected");
}).catch(err => {
    console.log(`error connecting to MongoDB ${err}`);
})

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

configurePassport(passport);

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('<a href="/api/auth/google">Login with google</a>');
});

app.use('/api/auth', AuthRoute)
app.use('/api/post', PostRoute)

app.listen(8000, () => {
    console.log('Server running on port 8000');
});