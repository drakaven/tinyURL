"use strict"
//create test

const express = require("express");
const app = express();
const PORT = 8080 || process.env.PORT; // default port 8080
const bodyParser = require("body-parser");
//const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');



const urlDatabase = {
  "b2xVn2": {
    url: "http://www.lighthouselabs.ca",
    user: "1%401.1"
  },
  "9sm5xK": {
    url: "http://www.google.com",
    user: "yourmom"
  }
};

const users = { hLsGcF :{ id : "hLsGcF", email :"1%401.1", password:"$2a$10$wk1XGvhfXdf4UtZFjGNAIOFuvfOhm11/ZNXvNtuJYCycvA/cjwxb6"}};

const generateRandomString = function() {
  let randSource = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let randString = "";
  for (let i = 0; i < 6; i++) {
    randString += randSource[(Math.round(Math.random() * (randSource.length - 1)))];
  }
  return randString
}

const cookieCheck = function(req, res) {
  if (req.session.username === undefined) {
    return false;
  } else {
    return true;
  }
}

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
//app.use(cookieParser());


app.use(cookieSession({
  name: 'session',
  keys: ['monkeyfun'],

  // Cookie Options
  // maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


//pages should redirect back to the page yo where on
//routes - these have a priority order

app.post("/register", (req, res) => {

  let userID = generateRandomString();
  if (!req.body.email || !req.body.password) res.redirect(400);
  // this doesnt if we have no users
  for (let userItem in users) {
    if (encodeURIComponent(req.body.email) === users[userItem].email) res.redirect(400, "ok");
  }
  users[userID] = {
    id: userID,
    email: encodeURIComponent(req.body.email),
    password: bcrypt.hashSync(req.body.password, 10)
  }
  res.redirect(302, 'http://localhost:8080/login');
});

app.get("/register", (req, res) => {
  let templateVars = {
    username: req.session.username
  };
  res.render("urls_registration", templateVars)
});



app.post("/logout", (req, res) => {
  //this clears the cookie but does not delete it
  req.session.username = undefined;
  res.redirect(302, 'http://localhost:8080/urls/');
});

app.get("/login", (req, res) => {
  let templateVars = {
    // username: req.cookies["username"]
  };
  res.render("urls_login", templateVars);
});


app.post("/login", (req, res) => {
  let passed = false
  for (let userItem in users) {
    if (encodeURIComponent(req.body.email) === users[userItem].email) {
      if (bcrypt.compareSync(req.body.password, users[userItem].password) === true) {
        req.session.username = req.body.email;
        res.redirect(302, 'http://localhost:8080/urls/')
      } else {
        res.redirect(403, {
          error: 'Incorrect password'
        })
      }
    }
  };
  res.redirect(403, {
    error: 'Username not found'
  });
});

app.post("/urls/create", (req, res) => {
  if (cookieCheck(req, res) === true) {
    let randString = generateRandomString();
    urlDatabase[randString] = {
      url: req.body.longURL,
      user: encodeURIComponent(req.session.username)
    };
    //console.log(urlDatabase);
  }
  res.redirect(302, 'http://localhost:8080/urls/'); // Respond with 'Ok' (we will replace this)
});


app.post("/urls/:id", (req, res) => {
  //if statement resolves bug from posting data to this page with wrong url
  debugger;
  if (encodeURIComponent(req.session.username) === urlDatabase[req.params.id].user) {
    if (urlDatabase[req.params.id]) {
      urlDatabase[req.params.id].url = req.body.update
    };
  }
  res.redirect(302, 'http://localhost:8080/urls/' + req.params.id);
});


app.post("/urls/:shortURL/delete", (req, res) => {
  let key = req.url.replace("/urls/", "").replace("/delete", "");

  if (encodeURIComponent(req.session.username) === urlDatabase[key].user) {
    delete urlDatabase[key];
  }
  res.redirect(302, 'http://localhost:8080/urls');
});

app.get("/u/:shortURL", (req, res) => {
  console.log(urlDatabase[req.params.shortURL]);
  res.redirect(302, urlDatabase[req.params.shortURL].url);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.session.username
  };
  res.render("urls_new", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls.user", (req, res) => {
  res.json(users);
});



app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    urls: urlDatabase,

  };
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.session.username
  };
  console.log(req.session.username);
  res.render("urls_index.ejs", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});