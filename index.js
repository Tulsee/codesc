import express from 'express';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import AuthRoute from "./routes/auth.route.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {connectTimeoutMS: 20000}).then(()=>{
    console.log("MongoDB Connected");
}).catch(err=>{
    console.log(`error connecting to MongoDB ${err}`);
})

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', AuthRoute)

app.listen(3000,()=>{
    console.log('Server running on port 3000');
});