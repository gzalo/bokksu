const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

mongoose.connect('mongodb://localhost:27017/bokksu', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Submission = mongoose.model('Submission', {
  commission: String,
  theme: String,
  firstName: String,
  lastName: String,
  fileName: String,
  date: { type: Date, default: Date.now },
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '../public/upload');
  },
  filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.listen(3000, () => {
  console.log('Listening at :3000...');
});

app.get('/api/submissions/:id', (request, response) => {
  try {
    const { id } = request.params;
    Submission.findById(id).then((data) => response.send(data));
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get('/api/submissions', (request, response) => {
  try {
    Submission.find().then((data) => response.send(data));
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post('/api/submissions', upload.single('file'), (req, resp) => {
  if (!req.file) {
    return resp.status(400).send({ error: 'Archivo faltante' });
  }
  const data = JSON.parse(req.body.data);
  if (!data.commission || !data.theme || !data.firstName || !data.lastName) {
    return resp.status(400).send({ error: 'Faltan completar campos' });
  }

  const submission = new Submission({
    commission: data.commission,
    theme: data.theme,
    firstName: data.firstName,
    lastName: data.lastName,
    fileName: req.file.filename,
  });

  console.log(req.file);

  submission
    .save()
    .then((ret) => {
      resp.send(ret);
    })
    .catch((err) =>
      resp.status(500).send({
        error: err.message || 'Error agregando entrega',
      }),
    );
  // resp.send({ status: "OK" });
});
