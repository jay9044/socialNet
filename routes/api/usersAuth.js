const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport"); // for protected route

//Load validator
const validateRegisterInput = require("../../validator/register");

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
  //every route that takes data
  //req.body is everything sent to this route
  const { errors, isValid } = validateRegisterInput(req.body); //destructuring

  //check for errors
  if (!isValid) {
    return res.status(400).json(errors); //if not valid it will return the errors object
  }

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

//@route GET api/usersAuth/login
//@desc   login users /return jwt token
//@access public

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({ email }).then(user => {
    //check for user
    if (!user) {
      errors.email = "Email already exists";
      return res.status(404).json(errors);
    }

    //check password
    bcrypt.compare(password, user.password).then(isMatch => {
      //true or false
      if (isMatch) {
        //user matched

        const payload = { id: user.id, name: user.name, avatar: user.avatar }; //create jwt payload

        //sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 36000 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res.status(400).json({ errorPassword: "wrong password" });
      }
    });
  });
});

//@route GET api/usersAuth/currentUser
//@desc   return current user
//@access private

router.get(
  "/currentUser",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // could you req.user but it would send user password too, so better to create a new object
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
