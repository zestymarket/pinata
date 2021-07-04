if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs-extra');
const fsTemp = require('fs-temp');
const FormData = require('form-data');

const port = 5000;
const app = express();
app.use(cors());
app.use(express.json());

const upload = multer();

var corsOption = {
  origin: './zesty\.market$/',
  optionsSuccessStatus: 200
}

app.get('/', cors(corsOption), (req, res) => {
  res.send("Welcome to Zesty Market's pinning gateway! Add pins here");
});

app.post('/api/pinFileToIPFS', cors(corsOption), upload.single("file"), (req, res) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  var path = fsTemp.writeFileSync(req.file.buffer);

  var data = new FormData();
  var stream = fs.createReadStream(path);
  data.append('file', stream);

  return axios
    .post(url, data, {
      headers: {
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: process.env.KEY,
          pinata_secret_api_key: process.env.SECRET
      }
    })
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error.response);
      res.send(error.response.data);
    });
});

app.post('/api/pinJSONToIPFS', cors(corsOption), (req, res) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  return axios
    .post(url, req.body, {
      headers: {
        pinata_api_key: process.env.KEY,
        pinata_secret_api_key: process.env.SECRET
      }
    })
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.send(error.response.data);
    });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});