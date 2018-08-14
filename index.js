var app = require('./server');
var config = require('./config/config');
const path = require('path')
const WebSocket = require('ws');
const {port} = config.dev;





// const socket = new WebSocket.Server({port:6060})

// socket.on('connection', function connection(w_socket) {
// 	w_socket.on('message',function incomming(message) {
// 		console.log('received: %s', message)
// 	})

// 	w_socket.send("hello from WebSocket server")
// })



var PORT =  process.env.PORT || port;

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// app.get('*', (req, res) => {
  // res.sendFile(path.join(__dirname+'/client/build/index.html'));
// });

app.listen(PORT, 
    () => console.log( `Server running on port ${PORT}`));

