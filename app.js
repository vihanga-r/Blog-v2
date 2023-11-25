const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://admin-vihanga:kurulla2k23!@cluster0.lktvjmn.mongodb.net/postsDB');

const app = express();

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));

// new schema for posts
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

// new model for posts
const Post = mongoose.model("Post", postSchema);



//////////////////////////////// GET routes ///////////////////////////////////////////////////////////////////////////////////////

app.get("/", function(req, res) {
    
    Post.find({}).exec().then(data => {
        
        res.render("home", {
            homeContent: homeStartingContent,
            postArray: data,
        });
    });    
});


app.get("/posts/:postId", function(req, res) {

    let requestedId = req.params.postId; 
    console.log("requestedId: " + requestedId);

    Post.findOne({_id: requestedId}).exec().then(post => {
        
        if (post === null) {
            res.render("404");
        } else {
            res.render("post", {
                postTitle: post.title,
                postContent: post.content
            });
        }
    })
    .catch((err) => {
        console.log(err);
        // res.render("status");
    });
});

app.get("/compose", function(req, res) {

    res.render("compose");
});


////////////////////////////////// POST routes ///////////////////////////////////////////////////////////////////////////////////

app.post("/compose", function(req, res) {


    let postTitle = req.body.title;
    let postContent = req.body.post;

    const entry = new Post({
        title: postTitle,
        content: postContent
    });

    Post.findOne({title: postTitle}).exec().then(data => {
        
        if (data === null) {
            entry.save();
        } else {
            // status.ejs
        }
        res.redirect("/");
    });
});

app.listen(3000, function() {
    console.log("Server started on port 3000")
});
