require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const validUrl = require('valid-url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended : false}));

app.use('/public', express.static(`${process.cwd()}/public`));

let links = [];//Se putea folosi mongoose, am preferat o varibial locala pentru a nu complica lucrurile inutil

app.post("/api/shorturl", (req, res) => {
  if (!validUrl.isUri(req.body.url) || !/^(http|https)/.test(req.body.url)){
      return res.json({
        "error" : "Invalid URL"
      });
  } 

  let currentLength = links.length;
  links.push({
    link : req.body.url,
    id : currentLength
  });

  res.json({
    original_url : links[links.length - 1]["link"], 
    short_url : links.length - 1
  });
});

app.get("/api/shorturl/:urlNum", (req, res) => {
  res.redirect(links[req.params.urlNum]["link"]);
});

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
