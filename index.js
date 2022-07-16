// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const date2Response = (res, date) => {
  const unix = date.valueOf();
  const utc = date.toUTCString();

  if (!isNaN(unix)) {
    res.json({ unix, utc });
  } else {
    res.json({ error: "Invalid Date" });
  }
}

app.get("/api/:date_string", function (req, res) {
  const val = parseInt(req.params["date_string"]);
  let date;

  if(!isNaN(val)) {
    date = new Date(val);
  }
  else {
    date = new Date(req.params["date_string"]);
  }

  date2Response(res, date);  
});

app.get("/api", function (req, res) {
  const date = new Date();
  date2Response(res, date);
});

const port = process.env.PORT || 3000;

// listen for requests :)
var listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
