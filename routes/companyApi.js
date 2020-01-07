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



module.exports = router;