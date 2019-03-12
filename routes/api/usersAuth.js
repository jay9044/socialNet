const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

//load user model
const User = require("../models/UsersAuth");

//@route GET api/usersAuth/test
//@desc   Tests usersAuth route
//@access public
router.get("/test", (req, res) => res.json({ message: "Users works" })); // referes to api/userAuth/${whatever router is entered here <<<}

//@route GET api/usersAuth/register
//@desc   register user
//@access public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({
        email: "email already exists"
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: 200, //size
        r: "pg", //raing
        d: "mm" // default
      }); // gravatar npm
      //get info from the form
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
