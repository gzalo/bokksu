const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
mongoose.connect("mongodb://localhost:27017/bokksu", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Submission = mongoose.model("Submission", {
  commission: String,
  theme: String,
  firstName: String,
  lastName: String,
  date: { type: Date, default: Date.now },
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "../public/upload");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage });

app.listen(3000, () => {
  console.log("Listening at :3000...");
});

app.get("/submissions", (request, response) => {
  try {
    Submission.find().then((data) => response.send(data));
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/submissions", upload.single("file"), (req, resp) => {
  if (!req.file) {
    return resp.status(400).send({ error: "Missing file" });
  }
  resp.send({ status: "OK" });
});

app.post("/submissions", (req, resp) => {
  if (
    !req.body.commission ||
    !req.body.theme ||
    !req.body.firstName ||
    !req.body.lastName
  ) {
    return resp.status(400).send({ error: "Invalid fields" });
  }

  const submission = new Submission({
    commission: req.body.commission,
    theme: req.body.theme,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  submission
    .save()
    .then((data) => {
      resp.send(data);
    })
    .catch((err) => {
      resp.status(500).send({
        error: err.message || "Error adding submission",
      });
    });
});
