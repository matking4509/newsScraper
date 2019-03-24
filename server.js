var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

// Require all models
var db = require("./models");

// Init Express
var app = express();
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Make public a static folder
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/newsScraper", { useNewUrlParser: true });
//Routes
//Scrape the New Articles
app.get("/scrape", function(req, res) {
});

//Get News Titles from the Database
app.get("/news", function(req, res) {
});

//Get Data for a specific news article.
app.get("/news/:id", function(req, res) {
});

//API Route to Post a comment
app.post("/api/comment", function(req, res) {
});

//API route to delete a news article
app.delete("/api/news/:id", function(req, res) {
});


// Start the server
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});