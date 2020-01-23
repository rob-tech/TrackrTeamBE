const express = require("express");
const request = require('request');
const router = express.Router();

router.get('/category', async (req, res) => {

  request('https://authenticjobs.com/api/?api_key=8d4a8b25dab4420c4cbc433f166552f7&method=aj.categories.getlist&format=json', function (error, response, body) {
    res.header('Access-Control-Allow-Origin', '*');

    if (!error && response.statusCode == 200) {
      var jobCategory = JSON.parse(body)
      res.send(jobCategory);
    }
  })
});

router.get('/contract', async (req, res) => {

  request('https://authenticjobs.com/api/?api_key=8d4a8b25dab4420c4cbc433f166552f7&method=aj.types.getlist&format=json', function (error, response, body) {
    res.header('Access-Control-Allow-Origin', '*');

    if (!error && response.statusCode == 200) {
      var contractType = JSON.parse(body)
      res.send(contractType);
    }
  })
});


// router.get('/:location', async (req, res) => {
//   var location = req.params.location
//   request( "https://www.reed.co.uk/api/1.0/search?locationName=" + location , {headers: {Authorization: "Basic MDYwY2VjMjktMDgyYy00MDMzLTgyZjEtMjFjZTMyNmEzYzY0Og=="}}, function (error, response, body) {
//     res.header('Access-Control-Allow-Origin', '*');
    
//     if (!error && response.statusCode == 200) {
//       var location = JSON.parse(body)
//       res.send(location);
//     }
//   }) 
// });

router.get('/:grade', async (req, res) => {
  var grade = req.params.grade
  request( "https://jobs.github.com/positions.json?description=" + grade, function (error, response, body) {
    res.header('Access-Control-Allow-Origin', '*');
    
    if (!error && response.statusCode == 200) {
      var positionGrade = JSON.parse(body)
      res.send(positionGrade);
    }
  }) 
});


module.exports = router;