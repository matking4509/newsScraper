var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var hbs = require("express-handlebars");

// Require all models
var db = require("./models");

// Init Express
var app = express();
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Make public a static folder
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/newsScraper", { useNewUrlParser: true });

var siteUrl = "https://www.slashdot.org";
//Routes
app.get("/", function (req, res) {
  var hbsObj = {};
  hbsObj.site = siteUrl;
  db.News.find({})
  // Specify that we want to populate the retrieved libraries with any associated books
  .populate("comments")
  .then(function(dbLibrary) {
    // If any Libraries are found, send them to the client with any associated Books
    hbsObj.news = dbLibrary;
    // console.log("hbsObj",hbsObj.news[0]);
    res.render("index", hbsObj);
  })
  .catch(function(err) {
    // If an error occurs, send it back to the client
    res.json(err);
  });
});

//Scrape the New Articles
app.get("/api/scrape", function(req, res) {
  axios.get(siteUrl).then(function(response) {
    var $ = cheerio.load(response.data);

    $("article").each(function(i, element) {
      // Save an empty result object
      var result = {};

      result.title = $(element).find(".story-title").children("a").text();
      result.link = $(element).find(".story-title").children("a").attr("href");
      result.text = $(element).find(".body").children(".p").text();

      // Create a new Article using the `result` object built from scraping
      db.News.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
  });
  res.render("scrape", {});
});

//API Route to Post a comment
app.post("/api/comment", function(req, res) {
  if (req.body.name === "") {
    req.body.name = "Anonymous Coward"
  }

  db.Comments.create({
      body: req.body.body,
      name: req.body.name})
    .then(function(dbComment) {
      // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.News.findOneAndUpdate({ _id: req.body.newsid}, { $push: { comments: dbComment._id } }, { new: true });
    })
    .then(function(dbNews) {
      // If the User was updated successfully, send it back to the client
      res.json(dbNews);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Start the server
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});