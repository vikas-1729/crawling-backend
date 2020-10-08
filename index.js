const express = require('express');
const port = process.env.PORT || 8000;
const app = express();
const cors = require('cors');
app.use(cors());
require('dotenv').config();
const db = require('./config/index');
app.use(express.urlencoded());
app.use(require('./router'));
app.listen(port, function (error) {
  if (error) {
    console.log(`error ${error}`);
    return;
  }
  console.log('connected to port 8000');
});
