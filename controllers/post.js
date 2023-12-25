const Post = require("../models/Post");
const User = require("../models/User");

// Creating a new post
exports.createPost = async (req, res) => {
  try {
    // Saving the file
    const post = await new Post(req.body).save();
    // Adding the user details
    await post.populate("user", "first_name last_name cover picture username");
    // Sending the response
    res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Fetching all the Posts
exports.getAllPosts = async (req, res) => {
  try {
    // Finding the account which user follows
    const followingTemp = await User.findById(req.user.id).select("following");
    const following = followingTemp.following;

    // Finding all post details of those accounts
    const followingPosts = await Post.find({ user: { $in: following } })
      .populate("user", "first_name last_name picture username cover")
      .populate("comments.commentBy", "first_name last_name picture username")
      .sort({ createdAt: -1 });
    // Finding the user's posts as well
    const userPosts = await Post.find({ user: req.user.id })
      .populate("user", "first_name last_name picture username cover")
      .populate("comments.commentBy", "first_name last_name picture username")
      .sort({ createdAt: -1 })
      .limit(10);

    // Combining the data
    followingPosts.push(...[...userPosts]);
    // Sorting it according to posting times(latest first)
    followingPosts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    res.json(followingPosts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Route to get all saved posts of a user
exports.getAllSavedPosts = async (req, res) => {
  try {
    // Assuming you have user information available in the request, such as through authentication
    const userId = req.user.id; // Adjust this based on your authentication setup

    // Fetch the user and populate the savedPosts array with post details
    const user = await User.findById(userId)
      .populate({
        path: "savedPosts.post",
        model: "Post", // Assuming your Post model is named 'Post'
        select: "type text images user background comments createdAt", // Adjust fields as needed
        populate: [
          {
            path: "user",
            model: "User",
            select: "first_name last_name picture username cover",
          },
          {
            path: "comments.commentBy",
            model: "User",
            select: "first_name last_name picture username",
          },
        ],
      })
      .select("savedPosts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract saved posts from the user
    const savedPosts = user.savedPosts
      .filter((savedPost) => savedPost.post !== null) // Filter out null values
      .map((savedPost) => savedPost.post);

    return res.status(200).json(savedPosts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Adding a new comment
exports.comment = async (req, res) => {
  try {
    const { comment, image, postId } = req.body;
    // Creating new comment for the given post
    let newComments = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            comment: comment,
            image: image,
            commentBy: req.user.id,
            commentAt: new Date(),
          },
        },
      },
      {
        new: true,
      }
    ).populate("comments.commentBy", "picture first_name last_name username");
    res.json(newComments.comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Bookmark Posts
exports.savePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const user = await User.findById(req.user.id);
    const check = user?.savedPosts.find(
      (post) => post.post.toString() == postId
    );
    if (check) {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: {
          savedPosts: {
            _id: check._id,
          },
        },
      });
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          savedPosts: {
            post: postId,
            savedAt: new Date(),
          },
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Deleting a post
exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndRemove(req.params.id);
    res.json({ status: "ok" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
