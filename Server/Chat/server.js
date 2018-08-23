// APIs
//Chat API
var chat = require("./API/api.js");

// Dependencies
//Express
var server = require("express")();
//Filesystem
var fs = require("fs");
//Path Corrector
var path = require("path");
//MD5 Hash Encryptor
var md5 = require("md5");

// Required Files
//ID List
var ids = require("../../id.json");
//Config
var config = require("./API/config.json")


//Get the Chat Event Emitter from the chat API
const Chat = chat.Chat;
//Check If a Client Sends a Message
Chat.on("msg", (msg, u, room) => {
	//Log the message and the sender in the terminal
	console.log(`Client ${u.name} has sent "${msg}"`);
	//Broadcast the message to all clients
	chat.send(msg, u, room, true);
});
//Check If a Client Connects
Chat.on("connection", (u) => {
	//Log the connection in the terminal
	console.log(`Client ${u.name} has connected.`);
	//Notify all clients of the connection
	chat.send(`${u.name} has joined.`);
});
// Check If a Client Disconnects
Chat.on("disconnect", (u) => {
	//Log the diconnected client in the terminal
	console.log(`Client ${u.name} has disconnected.`);
	//Notify all clients of the disconnected client
	chat.send(`${u.name} has left.`);
});
// Is Connected to Server(Client-Side API)
Chat.on("connected", () => {
	//Log the connection in the terminal
	//Dev Note: This is used for clients/bots
	console.log("Connected to server");
});
// Is Disconnected from Server(Client-Side API)
Chat.on("disconnected", () => {
	//Log the disconnection in the terminal
	//Dev Note: This is used for clients/bots
	console.log("Disconnected from server");
});
// New User
Chat.on("new", (ip) => {
	//Log that a new user(no id present) has connected in the terminal
	console.log("A new user has been registered.");
	ids.users.push(md5(ip));
});