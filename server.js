var express = require('express');
var http = require('http');
var io = require('socket.io');
 
 
var app = express();

app.use(express.static('./public'));
//Specifying the public folder of the server to make the html accesible using the static middleware

app.get('/', (req, res) => {
  console.log(req)
  res.send('Welcome to Comeet!\nmeet your study buddies, and maybe future friends :)\n')
})

var server = http.createServer(app).listen(8080);
//Server listens on the port 8080
io = io.listen(server); 
/*initializing the websockets communication , server instance has to be sent as the argument */
 
io.sockets.on("connection",function(socket){
    /*Associating the callback function to be executed when client visits the page and 
      websocket connection is made */
      
      // var message_to_client = {
      //   data:"Welcome to Comeet!\nmeet your study buddies, and maybe future friends :)"
      // }
      // socket.send(JSON.stringify(message_to_client)); 
      /*sending data to the client , this triggers a message event at the client side */
    console.log('Socket.io Connection with the client established');
    socket.on("message",function(data){
        /*This event is triggered at the server side when client sends the data using socket.send() method */
        data = JSON.parse(data);
 
        console.log(data);

        /*Printing the data */
        var ack_to_client = {
          data:'\nServer Received the message.'
        }
        socket.send(JSON.stringify(ack_to_client));
        /*Sending the Acknowledgement back to the client , this will trigger "message" event on the clients side*/

        if (!(data.email.endsWith('@post.bgu.ac.il'))){
          /*Printing the data */
          var err_to_client = {
            data:'ERROR! your email is not valid'
          }
          socket.send(JSON.stringify(err_to_client));
        }
        
    });
 
});
