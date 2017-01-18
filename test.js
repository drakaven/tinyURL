"use strict"
const request = require("request");

const options = {
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  method: 'post',
  body: 'username=jenkins',
  url: "http://localhost:8080/login/"
}

request.post(options, function(err, response, body){
    console.log(response.headers);
})