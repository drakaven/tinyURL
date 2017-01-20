"use strict"
const request = require("request");

const options = {
  url: "http://localhost:8080/urls/b2xVn2"
}

request.put(options, function(err, response, body){
    console.log(response.statusCode, body
      );
})

