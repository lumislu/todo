const router = require("express").Router();
const Post = require("../models/post-model");

const authCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect("/auth/login");
  }
};
router.get("/", authCheck, async (req, res) => {
  let postFound = await Post.find({ author: req.user._id });
  return res.render("profile", { user: req.user, posts: postFound });
});

router.get("/post", authCheck, (req, res) => {
  return res.render("post", { user: req.user });
});

router.post("/post", authCheck, async (req, res) => {
  let { title, content } = req.body;
  let newPost = new Post({
    title,
    content,
    author: req.user._id,
  });
  try {
    await newPost.save();
    return res.redirect("/profile");
  } catch (e) {
    res.flash("error_msg", "標題與內容都需要填寫");
    return res.redirect("/profile/post");
  }
});

router.get("/post/:_id", authCheck, async (req, res) => {
  let { _id } = req.params;
  try {
    let foundpost = await Post.findOne({ _id }).exec();
    return res.render("update", { user: req.user, post: foundpost });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.put("/post/:_id", authCheck, async (req, res) => {
  try {
    let { _id } = req.params;
    console.log(_id);
    let { title, content } = req.body;

    let newPost = await Post.findOneAndUpdate(
      { _id },
      { title, content, author: req.user._id },
      { new: true, runValidators: true, overwrite: true }
    );
    res.redirect("/profile");
  } catch (e) {
    res.send(e);
  }
});

router.delete("/post/:_id", authCheck, async (req, res) => {
  try {
    let { _id } = req.params;
    let deleteResult = await Post.deleteOne({ _id });
    res.redirect("/profile");
  } catch (e) {
    res.status(500).send(e.message);
  }
});
router.delete("/post", authCheck, async (req, res) => {
  try {
    await Post.deleteMany({ author: req.user._id });
    res.redirect("/profile");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;
