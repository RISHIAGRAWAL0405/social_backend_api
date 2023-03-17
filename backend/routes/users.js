const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const {verifyToken, verifyTokenMiddleware, decodeToken} = require('../helper');

//get a user
router.get("/user", verifyTokenMiddleware, async (req, res) => {
  const { access_token } = req.headers;
  const decodedValue = decodeToken(access_token);
  try {
    const userId = decodedValue.payload.data.userId;
    const user = await User.findById(userId);
    const { username, followers, followings } = user;
    res.status(200).json({ username, followers, followings});
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

//follow a user
router.post("/follow/:id", verifyTokenMiddleware, async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json({ message: "Success, you are now following this user!"});
      } else {
        res.status(400).json({ message: "You have already followed this User!"});
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a user
router.post("/unfollow/:id", verifyTokenMiddleware, async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json({ message: "Success: user has been unfollowed"});
      } else {
        res.status(400).json({ message: "you dont follow this user"});
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(400).json({message: "you cant unfollow yourself"});
  }
});

/*
//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }
});

 */
module.exports = router;
