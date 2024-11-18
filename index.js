require('dotenv').config();
const bodyParser = require("body-parser")
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

const urls = [];

app.route("/api/shorturl").post((req, res) => {
  const urlRegexp = /^https?:\/\/([a-zA-Z0-9\-]+\.)?[a-zA-Z0-9\-]+(\.[a-zA-Z]{2,})?(\.[a-zA-Z]{2,})(\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?$/i
  const { url } = req.body;

  console.log("URL", url);
  if (!url.match(urlRegexp)) return res.json({ error: "Invalid url" })

  const newRegister = {
    original_url: url.toLowerCase(), short_url: urls.length + 1
  }
  const isAlreadyAdded = urls.find((element) => element.original_url == url.toLowerCase());
  console.log(urls);
  if (urls.length > 0) {
    if (isAlreadyAdded === undefined) {
      urls.push(newRegister)
      return res.json(newRegister)
    } else {
      return res.json(isAlreadyAdded)
    }
  } else {
    urls.push(newRegister)
    return res.json(newRegister)
  }
})

app.get("/api/shorturl/:id", function (req, res) {
  console.log(req.params.id)
  console.log(urls)
  const findUrl = urls.find((element) => element.short_url == Number(req.params.id));
  console.log(findUrl)
  if (urls.length > 0 && findUrl !== undefined) {
    return res.redirect(findUrl.original_url)
  } else {
    return res.json({ error: "No short URL found for the given input" })
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
