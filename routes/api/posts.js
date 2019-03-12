const express = require("express");
const router = express.Router();

//@route GET api/posts/test
//@desc   Tests posts route
//@access public
router.get("/test", (req, res) => res.json({ message: "Posts works" })); // referes to api/userAuth/${whatever router is entered here <<<}
module.exports = router;
