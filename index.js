// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();
const mongo = require("mongodb");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const shortid = require("shortid");

const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
const { use } = require("express/lib/application");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/timestamp", function (req, res) {
  res.sendFile(__dirname + "/views/timestamp.html");
});

app.get("/requestHeaderParser", function (req, res) {
  res.sendFile(__dirname + "/views/requestHeaderParser.html");
});

app.get("/URLShortenerMicroservice", function (req, res) {
  res.sendFile(__dirname + "/views/URLShortenerMicroservice.html");
});

app.get("/exerciseTracker", function (req, res) {
  res.sendFile(__dirname + "/views/exerciseTracker.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/whoami", function (req, res) {
  res.json({
    ipaddress: req.socket.localAddress,
    language: req.headers["accept-language"],
    software: req.headers["user-agent"],
  });
});

// Exercise Tracker

let userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model("UserModel", userSchema);

let exerciseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const ExerciseModel = mongoose.model("ExerciseModel", exerciseSchema);

app.post(
  "/api/users/:_id/exercises",
  urlEncodedParser,
  jsonParser,
  async function (req, res) {
    const userId = req.params["_id"];

    const users = await UserModel.find({ _id: userId });

    if (users.length > 0) {
      const { description, duration, date } = req.body;
      const exercise = new ExerciseModel({
        userId,
        description,
        duration,
        date: (date ? new Date(date) : new Date()).getTime(),
      });

      const doc = await exercise.save();
      return res.json({
        username: users[0].username,
        description: doc.description,
        duration: doc.duration,
        date: new Date(doc.date).toDateString(),
        _id: doc.id.toString(),
      });
    } else {
      res.status = 404;
      return res.json({ error: "No such user" });
    }

    // description, duration, and optionally date
  }
);

app.get("/api/users", async (req, res) => {
  const docs = await UserModel.find({});
  res.json(docs);
});

app.post("/api/users", urlEncodedParser, jsonParser, async function (req, res) {
  const username = req.body["username"];

  const docs = await UserModel.find({ username });

  if (docs.length > 0) {
    return res.json({
      _id: docs[0]._id.toString(),
      username: docs[0].username,
    });
  } else {
    // const _id = shortid.generate();

    const user = new UserModel({
      username,
    });

    try {
      const doc = await user.save();
      return res.json({
        _id: doc._id.toString(),
        username: doc.username,
      });
    } catch (e) {}
  }
});

// timestamp
const date2Response = (res, date) => {
  const unix = date.getTime();
  const utc = date.toUTCString();

  if (!isNaN(unix)) {
    res.json({ unix, utc });
  } else {
    res.json({ error: "Invalid Date" });
  }
};

app.get("/api/:date_string", function (req, res) {
  let date;

  if (/^[1-9][0-9]*$/.test(req.params["date_string"])) {
    const val = parseInt(req.params["date_string"]);
    date = new Date(val);
  } else {
    date = new Date(req.params["date_string"]);
  }

  date2Response(res, date);
});

app.get("/api", function (req, res) {
  const date = new Date();
  date2Response(res, date);
});

// Shorten URL
let shortenedUrlSchema = new mongoose.Schema({
  shortenedUrl: {
    type: String,
    required: true,
    unique: true,
  },
  orgUrl: {
    type: String,
    required: true,
  },
});

const ShortenedUrlModel = mongoose.model("ShortenedUrl", shortenedUrlSchema);

app.post(
  "/api/shorturl",
  urlEncodedParser,
  jsonParser,
  async function (req, res) {
    const original_url = req.body.url;

    // check if valid URL
    if (
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
        original_url
      )
    ) {
      const docs = await ShortenedUrlModel.find({ orgUrl: original_url });

      if (docs.length > 0) {
        return res.json({ original_url, short_url: docs[0].shortenedUrl });
      } else {
        const id = shortid.generate();

        let shortenedUrl = new ShortenedUrlModel({
          shortenedUrl: id,
          orgUrl: original_url,
        });

        try {
          await shortenedUrl.save();
          res.json({ original_url, short_url: id });
        } catch (e) {}
      }
    } else {
      res.json({ error: "invalid url" });
    }
  }
);

app.get("/api/shorturl/:shortenedurl", async function (req, res) {
  const shortenedUrl = req.params["shortenedurl"];

  const docs = await ShortenedUrlModel.find({ shortenedUrl });

  if (docs.length > 0) {
    return res.redirect(docs[0].orgUrl);
  } else {
    res.statusCode = 404;
    return res.json({ error: "Path not found" });
  }
});

const port = process.env.PORT || 3000;

(async () => {
  await mongoose.connect(process.env.DB_URI);

  // listen for requests :)
  var listener = app.listen(port, function () {
    console.log("Your app is listening on port " + listener.address().port);
  });
})();
