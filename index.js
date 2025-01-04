import express from 'express';
import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("MongoDB Connected");
}).catch(err=>{
    console.log(`error connecting to MongoDB ${err}`);
})

const app = express();

app.listen(3000,()=>{
    console.log('Server running on port 3000');
});