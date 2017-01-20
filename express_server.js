"use strict"
//add returns to fix header set error



//create test
const express = require("express");
const app = express();
const PORT = 8080 || process.env.PORT; // default port 8080
const bodyParser = require("body-parser");
//const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');
const morgan = require('morgan');

const urlDatabase = {
  "b2xVn2": {
    url: "http://www.lighthouselabs.ca",
    user: "1%401.1",
    log: []
  },
  "9sm5xK": {
    url: "http://www.google.com",
    user: "yourmom",
    log: []
  }
};

const users = {
  hLsGcF: {
    id: "hLsGcF",
    email: "1%401.1",
    password: "$2a$10$wk1XGvhfXdf4UtZFjGNAIOFuvfOhm11/ZNXvNtuJYCycvA/cjwxb6"
  }
};

const uniqueVisitors = {};

const validateUser = function(req, res) {
  if (!req.session.username) {
    res.status(401).send("You must be logged in to view this page <a href=http://localhost:8080/login>Login</a>");
  }
}


const generateRandomString = function() {
  let randSource = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let randString = "";
  for (let i = 0; i < 6; i++) {
    randString += randSource[(Math.round(Math.random() * (randSource.length - 1)))];
  }
  return randString
}

app.set("view engine", "ejs");
//middleware
app.use(morgan('combined'))
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieSession({
  name: 'session',
  keys: ['monkeyfun'],
}))

app.post("/register", (req, res) => {
  let userID = generateRandomString();
  if (!req.body.email || !req.body.password) res.status(400).send("Email address and password required!");
  // this doesnt if we have no users
  for (let userItem in users) {
    if (encodeURIComponent(req.body.email) === users[userItem].email) res.status(400).send("Email address in use please choose another");
  }
  users[userID] = {
    id: userID,
    email: encodeURIComponent(req.body.email),
    password: bcrypt.hashSync(req.body.password, 10)
  }
  res.redirect(302, 'http://localhost:8080/login');
});

app.get("/register", (req, res) => {
  if (req.session.username) {
    res.redirect(302, 'http://localhost:8080/urls/');
  }
  res.render("urls_registration")
});

app.post("/logout", (req, res) => {
  //this clears the cookie but does not delete it
  req.session = null;
  res.redirect(302, 'http://localhost:8080/');
});
app.get("/login", (req, res) => {
  if (req.session.username) {
    res.redirect(302, 'http://localhost:8080/urls/');
  }
  res.render("urls_login");
});

app.post("/login", (req, res) => {
  let passed = false
  for (let userItem in users) {
    if (encodeURIComponent(req.body.email) === users[userItem].email) {
      if (bcrypt.compareSync(req.body.password, users[userItem].password) === true) {
        req.session.username = req.body.email;
        res.redirect(302, 'http://localhost:8080/urls/');
        return;
      } else {
        res.status(401).send("Password Incorrect");
      }
    }
  };
  res.status(401).send("Username not found");
});

app.post("/urls/create", (req, res) => {
  validateUser(req, res);
  let randString;
  if (req.session.username) {
     randString = generateRandomString();
    urlDatabase[randString] = {
      url: req.body.longURL,
      user: encodeURIComponent(req.session.username),
      log: []
    };
  }
  res.redirect(302, 'http://localhost:8080/urls/' + randString);
});



app.delete("/urls/:shortURL/", (req, res) => {
  let key = req.url.replace("/urls/", "").replace("/?_method=DELETE", "");
  let encodeName = encodeURIComponent(req.session.username)
  if (encodeName === urlDatabase[key].user) {
    delete urlDatabase[key];
  }
  res.redirect(302, 'http://localhost:8080/urls');
});

app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send("Short URL not found");
  }
  let shortURL = req.params.shortURL;
  let id = req.session.username || req.session.tempkey
  if (id === undefined) {
    id = generateRandomString();
    req.session.tempkey = id;
  }
  if (urlDatabase.hasOwnProperty(shortURL)) {
    urlDatabase[shortURL].log.push({
      id: id,
      time: Date.now()
    });
    if (uniqueVisitors.hasOwnProperty([req.params.shortURL]))
    { uniqueVisitors[req.params.shortURL][id] = id}
    else {
      uniqueVisitors[req.params.shortURL] = {};
      uniqueVisitors[req.params.shortURL][id] = id;
    };
    res.redirect(302, urlDatabase[shortURL].url);
  } else {
    res.redirect(302, 'http://localhost:8080/urls');
  }
});

app.get("/urls/new", (req, res) => {
  validateUser(req, res);
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

//?
app.put("/urls/:id", (req, res) => {
  if (!urlDatabase[req.params.id]) {
    res.status(404).send("Short URL not found");
  }
  validateUser(req, res);
  if (encodeURIComponent(req.session.username) !== urlDatabase[req.params.id].user) {
    res.status(403).send("You do not have access to this resource");
  }
  urlDatabase[req.params.id].url = req.body.update;
  res.redirect(302, 'http://localhost:8080/urls/' + req.params.id);
});

app.get("/urls/:id", (req, res) => {
  if (!urlDatabase[req.params.id]) {
    res.status(404).send("Short URL not found");
  }
  validateUser(req, res);

  if (encodeURIComponent(req.session.username) !== urlDatabase[req.params.id].user) {
    res.status(403).send("You do not have access to this resource");
  }
  let uniqueCount = 0;
  if (uniqueVisitors.hasOwnProperty(req.params.id)) {uniqueCount = Object.keys(uniqueVisitors[req.params.id]).length}
  let templateVars = {
    url: urlDatabase[req.params.id],
    username: req.session.username,
    unique: uniqueCount,
    shortURL : req.params.id
  };
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  validateUser(req, res);
  let templateVars = {
    urls: urlDatabase,
    username: req.session.username,
    unique: uniqueVisitors
  };
  res.render("urls_index.ejs", templateVars);
});

app.get("/", (req, res) => {
  if (req.session.username) {
    res.redirect(302, 'http://localhost:8080/urls');
    return;
  }
  res.redirect(302, 'http://localhost:8080/login');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});