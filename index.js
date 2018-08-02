var app = require('./server');
var config = require('./config/config');
const path = require('path')

const {port} = config.dev;




var PORT =  process.env.PORT || port;

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// app.get('*', (req, res) => {
  // res.sendFile(path.join(__dirname+'/client/build/index.html'));
// });

app.listen(PORT, 
    () => console.log( `Server running on port ${PORT}`));

