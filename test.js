"use strict"
const request = require("request");

const options = {
  url: "http://localhost:8080/register"
}

request.post(options, function(err, response, body){
    console.log(response.headers, response.statusCode, response.body);
})

