const express = require('express');
var path = require('path');
const session = require('express-session');
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const  util = require('util');
const debug = util.debuglog('server');
const app = express();
const cors = require('cors')


const routes = require('../routes/index');
const config = require('../config/config.js');
const authroutes = require('../routes/authroutes');

// Mongoose Conf!
require('../config/mongoose-config.js')(config);

// Express app configuration
// app.use(express.static('public'))
// .use(express.static(path.join(__dirname, 'client/build')));

// app.set('view engine', 'ejs');

require('../config/express-app-config.js')(app);

// error handler
app.use(function(err, req, res, next) {
   const message = err.message;
   console.log("..........",err);
  res.status(err.httpStatusCode).json(err.message)

})
.use(cors())
.use('/', routes)
.use('/auth',authroutes)

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// app.get('*', (req, res) => {
  // res.sendFile(path.join(__dirname+'/client/build/index.html'));

// });



module.exports = app;
