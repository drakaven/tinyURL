"use strict"
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = function() {
  let randSource = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let randString = "";
  for (let i = 0; i < 6; i++) {
    randString += randSource[(Math.round(Math.random() * (randSource.length - 1)))];
  }
  return randString
}

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));


//routes - these hava a priority order
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.update;
  res.redirect(302, 'http://localhost:8080/urls/' + req.params.id); // Respond with 'Ok' (we will replace this)
});


app.post("/urls/:shortURL/delete/", (req, res) => {
  let key = req.url.replace("/urls/", "").replace("/delete", "");
  delete urlDatabase[key];
  res.redirect(302, 'http://localhost:8080/urls'); // Respond with 'Ok' (we will replace this)
});


app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

app.post("/urls/create", (req, res) => {
  console.log(req.body); // debug statement to see POST parameters
  let randString = generateRandomString();
  urlDatabase[randString] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(302, 'http://localhost:8080/urls/' + randString); // Respond with 'Ok' (we will replace this)
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body); // debug statement to see POST parameters
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase
  };
  res.render("urls_index.ejs", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    urls: urlDatabase
  };
  res.render("urls_show", templateVars);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});