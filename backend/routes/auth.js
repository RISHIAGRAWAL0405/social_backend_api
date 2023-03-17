const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {generateToken, verifyToken} = require('../helper');

router.post('/', async (req, res) => {
  const { email, password, id } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  generateToken({ email, password: hashedPassword, userId: id}, function (error, data) {
    console.log()
    return res.status(200).send({ token : data});
  });
});

// Test Route to verify Token
router.post('/verify', async (req, res) => {
  const { token } = req.body;
  verifyToken(token, function (error, data) {
    if (!error) {
      return res.status(200).send({ message : 'Success'});
    } else {
      return res.status(403).send({ message : 'Invalid Token'});
    }
  })
});

/*

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("wrong password")

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
});

 */

module.exports = router;
