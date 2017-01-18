"use strict"
const request = require("request");

//Unit tests


// connection tests
request("http://localhost:8080/urls/", function(err, response, body) {
  console.assert(response.statusCode === 200);
  console.log("url test passed!");
});

request("http://localhost:8080/urls/b2xVn2", function(err, response, body) {
  console.assert(response.statusCode === 200);
  console.log("url:id test passed!");
});

request("http://localhost:8080/urls/new", function(err, response, body) {
  console.assert(response.statusCode === 200);
  console.log("url/new test passed!");
});

request("http://localhost:8080/u/b2xVn2", function(err, response, body) {
  console.assert(response.statusCode === 200);
  console.log("url/new test passed!");
});

//db tests
const deleteTest = function () {request.post('http://localhost:8080/urls/9sm5xK/delete').on('end' , function(){
  request("http://localhost:8080/urls.json", function(err, response, body) {
  const compare = {
    'b2xVn2': 'http://www.lighthouselabs.ca'
  };
  const parsed = JSON.parse(body)
  for (let key in compare) {
    console.assert(compare[key] === parsed[key]);
  }
  console.log("DB Delete passed");
});
});
}




//create test will be tricky and update

request("http://localhost:8080/urls.json", function(err, response, body) {
  const compare = {
    'b2xVn2': 'http://www.lighthouselabs.ca',
    '9sm5xK': 'http://www.google.com'
  };
  const parsed = JSON.parse(body)
  for (let key in compare) {
    console.assert(compare[key] === parsed[key]);
  }
  console.log("DB state passed");
}).on('end' , function(){
  deleteTest();
});








//create test
//update test
//login test
//logout test