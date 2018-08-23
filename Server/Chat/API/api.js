// Dependencies
//WebSocket
const WebSocket = require("ws");
//Events
const EventEmitter = require("events");
//MD5 Hash Encryptor
var md5 = require('md5');

// Required Files
//Config
var config = require("./config.json");


//Initiate Websocket
const wss = new WebSocket.Server({port: config.server.port})

// API WebSocket Functions
//wss.broadcast Function
wss.broadcast = function broadcast(data) {
	wss.clients.forEach(function each(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	});
}

// API Event Handling
//ChatEvent Class
class ChatEvent extends EventEmitter {}

// Server Variables
var Serv = {
	users: []
}

module.exports = {
	// API Variables
	port: config.server.port,

	// API Functions
	//Send Message
	send: (msg, sender, room, isClient) => {
		if (sender == undefined && !isClient) {
				wss.broadcast(`{"msg": "${msg}", "user": {"name": "", "room": "${room}"}}`);
				console.log(`Sent Message: ${msg}`);
			} else if(sender != undefined && !isClient) {
				wss.broadcast(`{"msg": "${msg}", "user": ${sender}}`);
				console.log(`Sent Message ${msg} as user ${sender.name} in room ${room}`);
			} else if(sender != undefined && isClient) {
				wss.broadcast(`{"msg": "${msg}", "user": ${sender}}`);
			}
	},
	sendraw: (msg) => {
		wss.broadcast(JSON.stringify(msg));
	},
	//  API Event Handling
	// API Event Emitters
	//Chat
	Chat: new ChatEvent(),
}
// New Event Listeners
//Chat
module.exports.Chat.once("newListener", (event, listener) => {});
var Chat = module.exports.Chat

// Event Emitters
//Message
wss.on("connection", (ws) => {
	ws.on("message", (message) => {
		if (JSON.parse(message).msg && JSON.parse(message).user) {
			Chat.emit("msg", JSON.parse(message).msg, JSON.parse(message).user);
		}
	});
});
//Client Connected
wss.on("connection", (ws, req) => {
	ws.on("message", (message) => {
		if (JSON.parse(message).name) {
			Chat.emit("connection", {name: JSON.parse(message).name, room: JSON.parse(message).room});
			Serv.users.push({name: JSON.parse(message).name, room: JSON.parse(message).room, ip: req.connection.remoteAddress});
		}
	});
});
//Client Disconnected
wss.on("connection", (ws, req) => {
	//var ip = req.connection.remoteAddress;
	ws.on("close", () => {
		var ip = req.connection.remoteAddress;
		for (var i = 0; i<Serv.users.length; i++) {
			if (ip == Serv.users[i].ip) {
				Chat.emit("disconnect", {name: Serv.users[i].name});
				Serv.users.splice(i, 1);
			}
		}
	});
});