import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";


export const register = async (req, res, next) => {
    const {name, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 12);
    const newUser = new User({name, email, password: hashedPassword})
    try {
        await newUser.save();
        res.status(201).json("user registered successfully");
    } catch (err) {
        return res.status(400).json({error: err});
    }
}

export const login = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({email})
        if (!validUser)
            return res.status(404).json("User not found with this email");
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) return res.status(401).json("Invalid password. Please try again!!!");
        const token = jwt.sign({id: validUser._id, email: validUser.email}, process.env.JWT_SECRET, {expiresIn: '1d'})
        res.status(200)
            .json({"access_token": token});
    } catch (err) {
        res.status(400).json({error: err});
    }
}
