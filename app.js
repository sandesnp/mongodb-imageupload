const express = require('express');
const app = express();
const multer = require('multer');
const GridFsStorage  = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const path = require('path');
const Cors = require('cors');
require('dotenv').config();

app.options('*', Cors());
app.use(Cors());

mongoose.connect(
  process.env.MONGODB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  function () {
    console.log(`Successfully connected to mongodb server`);
  }
);

//image upload to mongodb
const storage = new GridFsStorage({
  url: `${process.env.MONGODB}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  file: function (req, file) {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${file.fieldname}-${Date.now()}${ext}`;
    return { filename: filename, bucketName: 'image' };
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif') {
    return cb(null, true);
  }
  return cb(
    new Error(`The image with extension ${ext} is not permitted.`),
    false
  );
}

const upload = multer({ storage: storage, fileFilter: fileFilter });
app.post('/files', upload.single('image'), function (req, res) {
  res.json(req.file);
});

//---------------------------------------------------------------------
// image retrieved from mongodb
let gfs;

//establishing connection to mongodb server
const conn = mongoose.createConnection(process.env.MONGODB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
conn.once('open', function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('image'); //name has to be same as during upload
});

//showing all images metadata
app.get('/files', function (req, res) {
  gfs.files.find().toArray(function (err, files) {
    if (err) {
      return res.status(404).json({
        err: 'Something went wrong, please try again later',
      });
    }
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist',
      });
    }
    //if files exists
    return res.json(files);
  });
});

//showing single image metadata
app.get('/files/:filename', function (req, res) {
  gfs.files.findOne({ filename: req.params.filename }, function (err, file) {
    if (err) {
      return res.status(404).json({
        err: 'Something went wrong, please try again later',
      });
    }
    if (!file) {
      return res.status(404).json({
        err: 'No such file exists',
      });
    }
    //if files exists
    return res.json(file);
  });
});

//showing single image
app.get('/image/:filename', function (req, res) {
  gfs.files.findOne({ filename: req.params.filename }, function (err, file) {
    if (err) {
      return res.status(404).json({
        err: 'Something went wrong, please try again later',
      });
    }
    if (!file) {
      return res.status(404).json({
        err: 'No such file exists',
      });
    }
    //show image
    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  });
});

app.listen(5001, function () {
  console.log(`App running on port 5001`);
});
