const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const Post = require("../../schemas/PostSchema");
const User = require("../../schemas/UserSchema");
const APIFeatures = require("../../utils/apiFeatures");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req, res) => {
  try {
    const myPosts = await Post.find({
      postedByEmail: req.session.user.email,
    }).sort({ createdAt: -1 });

    res.status(200).render("my-posts", {
      title: "Všechny moje příspěvky",
      posts: myPosts,
    });
  } catch (err) {
    res.status(404).render("my-posts");
  }
});

router.post("/", async (req, res, next) => {
  try {
    const postData = {
      title: req.body.title,
      content: req.body.content,
      price: req.body.price,
      postedByName: req.session.user.name,
      postedByID: req.session.user._id,
      postedByEmail: req.session.user.email,
      postedByProfilePic: req.session.user.profilePic,
      type: req.body.type,
      category: req.body.category,
      level: req.body.level,
      group: req.body.group,
      environment: req.body.environment,
    };
    console.log(postData);
    let newPost = await Post.create(postData);

    res.status(201).send({
      newPost: newPost,
      status: "success",
    });
  } catch (err) {
    res.status(400).send({
      status: "fail",
      errorMessage: "Něco se porouchalo, zkuste to prosím znovu :-)",
    });
  }
});

module.exports = router;
