"use strict"
const request = require("request");

let options = {
  url: "http://localhost:8080/urls/create"
}

request.post(options, function(err, response, body){
    console.log(response.statusCode, body
      );
})

options = {
  url: "http://localhost:8080/urls/cxcxzx"
}

request.post(options, function(err, response, body){
    console.log(response.statusCode, body
      );
})

options = {
  url: "http://localhost:8080/urls/b2xVn2"
}

request.put(options, function(err, response, body){
    console.log(response.statusCode, body
      );
})


options = {
  url: "http://localhost:8080/register"
}

request.post(options, function(err, response, body){
    console.log(response.statusCode, body
      );
})


