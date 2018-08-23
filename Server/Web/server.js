// Dependencies
//Express
var server = require("express")();
//Filesystem
var fs = require("fs");
//Web API
var web = require("./API/api.js");
//Config
var config = require("./API/config.json");
// Variables
var debug_name = "[DEBUG]: ";


// Server
//Send Home Page
server.get("(/lobby)?" , (req, res) => {
	res.send(fs.readFileSync(__dirname+"/htdocs/lobby.html", "utf8"));
});
//Send Room
server.get("/*[^lobby^Client.js]\?room", (req, res) => {
	res.send(fs.readFileSync(__dirname+"/htdocs/room.html", "utf8"));
});
//Send Scripts
server.get("/Client.js", (req, res) => {
	res.send(fs.readFileSync(__dirname+"/htdocs/Client.js", "utf8"));
});
//Send Anything in htdocs
server.get("/*", (req, res) => {
	res.send(fs.readFileSync(__dirname+"/htdocs"+req.path, "utf8"));
});

server.listen(config.server.port, () => {if(config.server.debug==true){console.log(debug_name+"Started website on port "+config.server.port+".")}});