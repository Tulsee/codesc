import Post from "../models/Post.model.js";


export const getPosts = async (req, res) => {
    try{

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit)||10;
        const skip = (page-1)*limit;

        const filter = {}

        if(req.query.status){
            filter.status = req.query.status
        }

        if(req.query.startDate && req.query.endDate) {
            filter.createdAt ={
                $gte: new Date(req.query.startDate),
                $lte: new Date (req.query.endDate)
            }
        }

        if(req.query.title){
            filter.title = { $regex: req.query.title, $options: 'i' };
        }

        const totalPosts = await Post.countDocuments(filter);

        const posts = await Post.find(filter)
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)


        return res.status(200).json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
            postsPerPage: limit
        });

    }catch (error) {
        return res.status(500).json({
            message: "Error fetching posts",
            error: error.message
        });
    }
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

export const getPostById = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json({ post });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching post", error });
    }
}

export const updatePost = async (req, res) => {
    const postId = req.params.id;
    const user = req.user
    const { title, description } = req.body;

    try{
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (user.role === 'admin' || post.user.toString() === user.id) {
           
            const updatedPost = await Post.findByIdAndUpdate(postId,{
                $set:{
                    title, description
                },
            },{new:true})

            return res.status(200).json({ message: "Post updated successfully", updatedPost });
        } else {
            return res.status(403).json({ message: "Forbidden: You do not have permission to update this post" });
        }
    }catch(error){
        return res.status(500).json({ message: "Error updating post", error });
    }
}

export const deletePost = async (req, res) => {
    const postId = req.params.id;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        await Post.findByIdAndDelete(postId);
        return res.status(200).json({ message: "Post deleted successfully" });

    }catch(error){
        return res.status(500).json({ message: "Error deleting post", error });
    }
}

export const getAllPostsByUserId = async(req, res)=>{
    try{
        const userId = req.params.userId

        const posts = await Post.find({user:userId})

        if(posts.length===0){
            return res.status(404).json({message:"This user do not have any post created"})
        }

        return res.status(200).json(posts)
    }catch(error){
        return res.status(500).json({message:'Error while getting post', error})
    }
}