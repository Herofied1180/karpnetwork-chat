// Declare Variables
var con_name = "[CONSOLE]: ";
var debug_name = "[DEBUG]: ";
// Notify the user that the server is starting
console.log(con_name+"Starting server...");
// Start the chat server
require("./Server/Chat/server.js");
// Start the express server
require("./Server/Web/server.js")
// Notify the user that the server is started
console.log(con_name+"Server successfully started.");