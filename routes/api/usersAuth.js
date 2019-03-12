const express = require("express");
const router = express.Router();

//@route GET api/usersAuth/test
//@desc   Tests usersAuth route
//@access public
router.get("/test", (req, res) => res.json({ message: "Users works" })); // referes to api/userAuth/${whatever router is entered here <<<}
module.exports = router;
