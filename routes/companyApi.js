const express = require("express");
const request = require('request');
const redis = require("redis");
const fetch = require('node-fetch');
const router = express.Router();

// const REDIS_PORT = process.env.PORT || 6379;
const REDIS_PORT = process.env.PORT
const client = redis.createClient(REDIS_PORT)


// router.get('/:url', async (req, res) => {
//   var url = req.params.url
//   request("https://jobs.github.com/positions.json?" + url, function (error, response, body) {
//     res.header('Access-Control-Allow-Origin', '*');
//     if (!error && response.statusCode == 200) {
//       let filteredSearch = JSON.parse(body)
//       // getCachedData(filteredSearch)
//       res.send(filteredSearch);
//       client.setex(url, 10, JSON.stringify(filteredSearch))
//     }
//   })
// });


async function getData(req, res, next) {
  try {
    console.log('Fetching Data...');
    const { url } = req.params;

    const response = await fetch(`https://jobs.github.com/positions.json?${url}`, {
      headers: { 'Access-Control-Allow-Origin': "*" }
    })
    const data = await response.json()

    client.setex(url, 1440, JSON.stringify(data))
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
}

function cache(req, res, next) {
  const { url } = req.params;

  client.get(url, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.send(data);
      // getKeys()
    } else {
      next();
    }
  });
}

// function getKeys(req, res, next) {
// client.keys('*', function (err, keys) {
//   if (err) return console.log(err);
//   if(keys){
//       console.log(keys)
//   }
// });
// }

router.get('/:url', cache, getData);


module.exports = router;