var express = require("express");
var app = express();
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverrise = require("method-override")
var expressSanitizer  = require("express-sanitizer")



mongoose.connect("mongodb://localhost/restful_blog_app");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"))
app.set("view engine","ejs");
app.use(methodOverride("_method"));


var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:{type: Date, default:Date.now}
})
var Blog =  mongoose.model("Blog",blogSchema);

app.get("/",function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
  Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs});
        }
    });
});

app.get("/blogs/new",function(req,res){
    res.render("new");
})

app.post("/blogs",function(req,res){
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body)
    console.log(req.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    })
})

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundblog})
        }
    })
})

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundBlog})
        }
    })
})

app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" +req.params.id);
        }
    });
});

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndDelete(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
})
app.listen("3000",function(){
    console.log("Now serving you on Port 3000");
});