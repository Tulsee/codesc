import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import upload from "../utils/multerConfig.js";


export const register = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({error: err.message});
        }

        const {name, email, password} = req.body;
        const hashedPassword = bcryptjs.hashSync(password, 12);

        let profileImageUrl = 'https://pxbar.com/wp-content/uploads/2023/09/girl-pic-for-instagram-profile-1.jpg'; // Default image URL

        if (req.file) {
            profileImageUrl = `/public/uploads/${req.file.filename}`; // Save the destination URL
        }

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            profile_image: profileImageUrl
        });

        try {
            await newUser.save();
            return res.status(201).json({message: "User registered successfully"});
        } catch (err) {
            return res.status(400).json({error: err.message});
        }
    });
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

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({error: err.message});
        }

        try {
            if (req.body.email) {
                const existingUser = await User.findOne({email: req.body.email});
                if (existingUser && existingUser._id.toString() !== userId) {
                    return res.status(400).json({error: 'Email is already taken by another user'});
                }
            }

            if (req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 12);
            }

            let profileImageUrl = undefined;
            if (req.file) {
                profileImageUrl = `/public/uploads/${req.file.filename}`;
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        ...(profileImageUrl && {profile_image: profileImageUrl})
                    },
                },
                {new: true}
            );

            if (!updatedUser) {
                return res.status(404).json({error: 'User not found'});
            }

            const {password, ...rest} = updatedUser._doc;
            return res.status(200).json(rest);
        } catch (err) {
            return res.status(400).json({error: err.message});
        }
    });
}

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }

        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json({message: "User has been deleted successfully"});
    } catch (err) {
        return res.status(400).json({error: err.message});
    }
};