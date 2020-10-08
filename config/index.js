const mongoose = require('mongoose');

//fill your database name here

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/crawling_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind('console', 'error'));

db.once('open', function () {
  console.log('welcome connect to database');
});

module.exports = db;
//process.env.MONGODB_URL || 'mongodb://localhost/crawling_db',
//Mongoose
//'mongodb+srv://singh99vikas:Mongoose@cluster0.snh5a.mongodb.net/<crawling_db>?retryWrites=true&w=majority',
