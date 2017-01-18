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
  console.log("u/redirect");
});

//register login test
const options = {
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  method: 'post',
  body: 'username=loginTest',
  url: "http://localhost:8080/login/"
}
// // rework
// request.post(options, function(err, response, body){
//     console.assert(response.headers['set-cookie'][0].substring(0, 18) === 'username=loginTest')
//     console.log("Login passed")
// }).on('end', function(){
//   request.post("http://localhost:8080/logout" , function(err, response, body) {
//     console.assert(response.headers['set-cookie'][0].substring(0, 9) === 'username=')
//     console.log("Logut passed")
//   });
// });






// // db tests
// const deleteTest = function () {request.post('http://localhost:8080/urls/9sm5xK/delete').on('end' , function(){
//   request("http://localhost:8080/urls.json", function(err, response, body) {
//   const compare = {
//     'b2xVn2': 'http://www.lighthouselabs.ca'
//   };
//   const parsed = JSON.parse(body)
//   for (let key in compare) {
//    // console.assert(compare[key] === parsed[key]);
//   }
//   console.log("DB Delete passed");
//   //console.log(parsed);
// });
// });
// }

// const createTest = function () {request.post('http://localhost:8080/urls/create').form({longURL : 'Testurl'}).on('end' , function(){
//   request("http://localhost:8080/urls.json", function(err, response, body) {
//   const parsed = JSON.parse(body)
//   console.log(parsed);
// });
// });
// }

// const updateTest =  function () {request.post('http://localhost:8080/urls/b2xVn2')
// .form({update : 'http:test'}).on('end' , function(){
//   request("http://localhost:8080/urls.json", function(err, response, body) {
//   const parsed = JSON.parse(body)
//   console.log(parsed);
// });
// });
// }
// //create and update test will be tricky
// const DBbegin = function (body){
//   const compare = {
//     'b2xVn2': 'http://www.lighthouselabs.ca',
//     '9sm5xK': 'http://www.google.com'
//   };
//   const parsed = JSON.parse(body)
//   for (let key in compare) {
//     console.assert(compare[key] === parsed[key]);
//   }
//   console.log("DB state passed");
// }

// request("http://localhost:8080/urls.json", function(err, response, body) {
//   DBbegin(body);
// })
// .on('end' , function(){
//   deleteTest();
// }).on('end' , function(){
//   createTest();
//   createTest();
// }).on('end' , function() {
//   updateTest();
// });




