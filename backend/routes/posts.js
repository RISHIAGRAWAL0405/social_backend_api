const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const {verifyTokenMiddleware, decodeToken} = require('../helper');

//create a post
router.post("/posts", verifyTokenMiddleware, async (req, res) => {
  const { access_token } = req.headers;
  const decodedValue = decodeToken(access_token);
  const newPost = new Post(Object.assign({}, {userId: decodedValue.payload.data.userId}, req.body));
  try {
    const { _id, title, description, createdAt } = await newPost.save();
    res.status(200).json({ postId: _id, title, description, createdAt});
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post
router.delete("/posts/:id", verifyTokenMiddleware, async (req, res) => {
  try {
    const { access_token } = req.headers;
    const decodedValue = decodeToken(access_token);
    const { userId } = decodedValue.payload.data;
    const post = await Post.findById(req.params.id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json({ message: "Success: the post has been deleted"});
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like
router.post("/like/:id", verifyTokenMiddleware, async (req, res) => {
  try {
    const { access_token } = req.headers;
    const decodedValue = decodeToken(access_token);
    const { userId } = decodedValue.payload.data;
    const post = await Post.findById(req.params.id);
    console.log(post);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      return res.status(200).json({ message: 'Success: Like'});
    } else {
      // await post.updateOne({ $pull: { likes: req.body.userId } });
      return res.status(200).json({ message: 'Duplicate Like'});
    }
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

//unlike a post
router.post("/unlike/:id", verifyTokenMiddleware, async (req, res) => {
  try {
    const { access_token } = req.headers;
    const decodedValue = decodeToken(access_token);
    const { userId } = decodedValue.payload.data;
    const post = await Post.findById(req.params.id);
    console.log(userId, post);
    if (post.likes.includes(userId)) {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      return res.status(200).json({ message: 'Success: Dislike'});
    } else {
      return res.status(200).json({ message: 'No Likes present'});
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post
router.post("/comment/:id", async (req, res) => {
  try {
    const { access_token } = req.headers;
    const { comment } = req.body;
    const decodedValue = decodeToken(access_token);
    const { userId } = decodedValue.payload.data;
    const post = await Post.findById(req.params.id);
    const result = await post.updateOne({ $push: { comments: comment } });
    return res.status(200).json({ result });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }

});

//get a post
router.get("/posts/:id", verifyTokenMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user's all posts
router.get("/all_posts", async (req, res) => {
  try {
    const { access_token } = req.headers;
    const decodedValue = decodeToken(access_token);
    const { userId } = decodedValue.payload.data;
    const posts = await Post.find({ userId: userId });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
