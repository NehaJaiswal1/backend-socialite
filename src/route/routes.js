

const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const passport = require("passport");


//USER 
router.post("/register",  userController.userRegister);
router.post("/login", userController.userLogin);



router.get("/auth/facebook", passport.authenticate("facebook"));
router.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/auth/success",
  failureRedirect: "/auth/failure",
}));
router.get("/auth/success", (req, res) => {
    res.json({ status: true, message: "Logged in successfully!" });
  });
  
  router.get("/auth/failure", (req, res) => {
    res.json({ status: false, message: "Failed to log in." });
  });
  

  // Route to start GitHub authentication
router.get("/auth/github", passport.authenticate("github"));

// GitHub callback route
router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    successRedirect: "/auth/success",
    failureRedirect: "/auth/failure",
  })
);



router.get("/auth/twitter", passport.authenticate("twitter"));

// Callback route for Twitter to redirect to
router.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", {
    successRedirect: "/auth/success",
    failureRedirect: "/auth/failure",
  })
);

// Success and Failure routes


router.all('*/', function(req, res){
    return res.status(400).send({status:false, message:"Invalid Path"})
})

module.exports = router;