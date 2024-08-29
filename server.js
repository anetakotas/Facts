//Written by Aneta Kotas
//For Web Application Developement, CA2
//Year 2024/08/29

const express = require("express"),
app = express();
const fs = require("fs");
const mongoose = require("mongoose");
const Fact = require("./models/fact");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

//routes to index page
app.get("/", function (req, res) {
  res.render("index");
});

//routes to random facts page and passes the array with random facts to the document
app.get("/randomFacts", function (req, res) {
  var randomFacts = [
    {
      context: 'Honey never spoils; it can last thousands of years.'
    },
    {
      context: 'Octopuses have three hearts and blue blood.'
    },
    {
      context: 'Bananas are berries, but strawberries arent.'
    },
    {
      context: 'A day on Venus is longer than its year.'
    },
    {
      context: 'Human bones are stronger than steel.'
    }
     ];
  res.render("randomFacts", {
    randomFacts: randomFacts
  });
});

//reads json file with facts about the author
var anetaFacts = JSON.parse(fs.readFileSync("anetaFacts.json", "utf8"));

//routes to facts about the author page and passes variable with json file
app.get("/factsAboutMe", function (req, res) {
  res.render("factsAboutMe", {anetaFacts});
});

//routes to facts about you page and the code accesses the data in database, looks for entries and passes them to the document to display everything as a list
app.get("/factsAboutYou", function(req, res) {
  Fact.find({})
    .then(facts => {
      res.render("factsAboutYou", {factsList: facts});
    })
    .catch(err => {
      res.status(500).send("Error")
    })
});

//posting a new fact entry to the database via a form, then reloads the page
app.post("/factsAboutYou", function(req, res) {
  var newFact = new Fact({
    name: req.body.name,
    context: req.body.context
  });
  newFact.save();
  res.redirect("/factsAboutYou");
});

//finding the right fact using id variable and deleting it
app.get("/delete/:id", function(req, res) {
  Fact.findByIdAndDelete({_id: req.params.id})
    .then(() => {
      res.redirect("/factsAboutYou");
    })
    .catch(err => {
      console.error("Error:", err);
    })
});

//finding right fact using id and updating it
app.get("/edit/:id", (req, res, next) => {
  Fact.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then(docs => {
      res.render("edit", { fact: docs });
    })
    .catch(err => {
      console.log("Error:", err);
      next(err);
    });
});

//sending the updated data to the db, then updating the page
app.post("/edit/:id", function(req, res) {
  Fact.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(() => {
      res.redirect("/factsAboutYou");
    })
    .catch(err => {
      console.error("Error:", err);
    })
});

//starting the server
app.listen(8080, function () {
  console.log("Server is running on port 8080 ");
});

//connecting to the database
mongoose.connect("mongodb+srv://aneta:password123!@web-dev-artsy.bpdnxol.mongodb.net/artsy?retryWrites=true&w=majority&appName=web-dev-artsy")
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });