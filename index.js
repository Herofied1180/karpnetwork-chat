var fs = require("fs")
var express = require("express")
var app = express()
const WebSocket = require('ws')

var page = fs.readFileSync('index.html', 'utf8')
var c = fs.readFileSync('Client.js', 'utf8')
var history = fs.readFileSync('chat.txt', 'utf8')

var chat = {
  chatMsg: JSON.stringify({msg: "", username: ""})
};

var WebSocketServer = WebSocket.Server,
  wss = new WebSocketServer({port: 40510})

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function (ws, req) {
  ws.on('message', function (message) {
    if (JSON.parse(message).msg && JSON.parse(message).username) {
      console.log(`Received Message: ${JSON.parse(message).username}: ${JSON.parse(message).msg}`)
    }
    var ip = req.connection.remoteAddress;
    //ws.send(`${JSON.parse(message).username}: ${JSON.parse(message).msg}`)
    fs.writeFileSync(`chat.txt`, `${fs.readFileSync(`chat.txt`)}-${message}`)
    wss.broadcast(message);
    //setInterval(function(){for(var i;i<500;i++){}}, 1)
  })
  ws.on("close", () => {
    console.log(req.connection.remoteAddress);
  });
  //ws.send("test")
  ws.send(JSON.stringify({msg: "Welcome to MPC(Multiplayer Chat)!", username: "MPChat"}))
})

// GET method route
app.get('/', function (req, res) {
	res.send(page)
})

// GET method route
app.get('/Client.js', function (req, res) {
  res.send(c)
})

app.get('/chat.txt', function (req, res) {
  res.send(history)
})

app.listen(3000)