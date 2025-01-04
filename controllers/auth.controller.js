import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    const {name, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 12);
    const newUser = new User({name, email, password: hashedPassword})
    try {
        await newUser.save();
        return res.status(201).json("user registered successfully");
    } catch (err) {
        return res.status(400).json({error: err});
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({email})
        if (!validUser)
            return res.status(404).json("User not found with this email");
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) return res.status(401).json("Invalid password. Please try again!!!");
        const token = jwt.sign({
            id: validUser._id,
            email: validUser.email,
            role: validUser.role
        }, process.env.JWT_SECRET, {expiresIn: '1d'})
        return res.status(200)
            .json({"access_token": token});
    } catch (err) {
        return res.status(400).json({error: err});
    }
}

export const getUser = async (req, res) => {
    const userId = req.user.id

    const user = await User.findById(userId)


    if (!user) return res.status(404).json({"message": "user not found!!!"})


    const {password: pass, ...rest} = user._doc
    return res.status(200).json(rest);
}

export const updateUser = async (req, res) => {
    const userId = req.params.id;
    try {
        if (req.body.email) {
            const existingUser = await User.findOne({email: req.body.email});
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).json({error: 'Email is already taken by another user'});
            }
        }
        if (req.body.password) {
            req.body.password = await bcrypt.hashSync(req.body.password, 12);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            },
        }, {new: true})
        const {password, ...rest} = updatedUser._doc
        return res.status(200).json(rest);
    } catch (err) {
        return res.status(400).json({error: err});
    }
}
