import Post from "../models/Post.model.js";
export const getPosts = async (req, res) => {
return res.status(200).json({message: "getPosts"});
}

export const createPost = async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }
    if (!description) {
        return res.status(400).json({ message: "Description is required" });
    }

    const newPost = new Post({ title, description, user: userId });

    try {
        await newPost.save();
        return res.status(201).json({ message: "Post created successfully", newPost });
    } catch (error) {
        return res.status(500).json({ message: "Error creating post", error });
    }
}