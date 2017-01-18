"use strict"
//create test

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');



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
app.use(cookieParser());

//routes - these have a priority order

app.post("/logout", (req, res) => {
  //this clears the cookie but does not delete it
  res.clearCookie('username');
  res.redirect(302, 'http://localhost:8080/urls/');
});


app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  console.log(req.body);
  res.redirect(302, 'http://localhost:8080/urls/');
});

app.post("/urls/create", (req, res) => {
  let randString = generateRandomString();
  urlDatabase[randString] = req.body.longURL;
  //console.log(urlDatabase);
  res.redirect(302, 'http://localhost:8080/urls/'); // Respond with 'Ok' (we will replace this)
});


app.post("/urls/:id", (req, res) => {
  //if statement resolves bug from posting data to this page with wrong url
  if (urlDatabase[req.params.id]) urlDatabase[req.params.id] = req.body.update;
  res.redirect(302, 'http://localhost:8080/urls/' + req.params.id); // Respond with 'Ok' (we will replace this)
});


app.post("/urls/:shortURL/delete", (req, res) => {
  let key = req.url.replace("/urls/", "").replace("/delete", "");
  delete urlDatabase[key];
  res.redirect(302, 'http://localhost:8080/urls'); // Respond with 'Ok' (we will replace this)
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(302, urlDatabase[req.params.shortURL]);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_index.ejs", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});