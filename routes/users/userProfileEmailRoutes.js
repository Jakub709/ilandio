const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../../schemas/UserSchema");
const Post = require("../../schemas/PostSchema");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/:email", async (req, res, next) => {
  try {
    const clickedUserEmail = req.params.email;
    const loggedinUserID = req.session.user._id;
    const loggedinUserEqualsClicked =
      clickedUserEmail == loggedinUserID ? "disabled-button" : "active-button";
    const userProfile = await User.findOne({ email: clickedUserEmail });
    // console.log(userProfile);
    // console.log(clickedUserEmail);
    let follow = "";
    let unfollow = "";
    if (userProfile.followers.includes(loggedinUserID)) {
      follow = "follow-non-active";
      unfollow = "follow-active";
    } else {
      follow = "follow-active";
      unfollow = "follow-non-active";
    }

    const postsUser = await Post.find({
      postedByEmail: clickedUserEmail,
    }).sort({ createdAt: -1 });
    // console.log(postsUser);
    const followersArray = userProfile.followers;
    // console.log(followersArray);
    const followingsArray = userProfile.following;
    // console.log(followingsArray);
    const followers = await User.find({
      _id: { $in: followersArray },
    });
    const followings = await User.find({
      _id: { $in: followingsArray },
    });
    const followersNumber = followersArray.length;
    // console.log(followersNumber);
    const followingsNumber = followingsArray.length;
    // console.log(followingsNumber);
    res.status(200).render("user-profile", {
      posts: postsUser,
      loggedinUserEqualsClicked: loggedinUserEqualsClicked,
      userProfile: userProfile,
      follow: follow,
      unfollow: unfollow,
      followers: followers,
      followings: followings,
      followersNumber: followersNumber,
      followingsNumber: followingsNumber,
    });
  } catch (err) {
    res.status(404).render("error");
  }
});

module.exports = router;
