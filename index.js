require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bp = require('body-parser');
const dns = require('dns');
const dnsOptions = {all: true};

mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;

const urlSchema = new Schema ({
  originalUrl: {type: String, required: true},
  shortUrl: String
});

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use("/api/shorturl", bp.urlencoded({extended: true}));
app.use(bp.json());

app.post('/api/shorturl', (req, res) => {
  const urlOriginal = req.body.url;
  let urlPattern = /^https?:\/\/+/;
  let hostName = urlOriginal.split("//")[1];
  if (urlPattern.test(urlOriginal) == false) {
      res.json({error: "Invalid Url"});
  } else {
  dns.lookup(hostName, dnsOptions, (err, address) => {
    if (err) { 
      console.log(err);
      res.json({error: "Invalid Hostname"});
    } else {
      console.log(address);
      res.json({"original_url": urlOriginal, "short_url": "hold"});
    };
  });
  };
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
