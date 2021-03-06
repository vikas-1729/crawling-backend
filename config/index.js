const mongoose = require('mongoose');

//fill your database name here
mongoose.connect(
  process.env.MONGO_DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on('error', console.error.bind('console', 'error'));

db.once('open', function () {
  console.log('welcome connect to database');
});

module.exports = db;
