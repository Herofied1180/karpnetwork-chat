// Dependencies
//Filesystem
var fs = require("fs");

// Required Files
//Config
var config = require("./config.json");

// API Functions
//Get Website File
module.exports.getFile = function (filename, htdocs) {
	if (htdocs[htdocs.length] != "/") {
		fs.readFileSync(`${htdocs}/${filename}`);
	} else {
		fs.readFileSync(`${htdocs}/${filename}`);
	}
};
//Set/Get Default Room
module.exports.defaultRoom = {
	set: function(filename){
		config.server.defaultRoom = filename
	},
	get: function(){
		return config.server.defaultRoom
	}
};