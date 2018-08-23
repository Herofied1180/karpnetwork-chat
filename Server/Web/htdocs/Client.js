// API v1
// Websocket Handling
var wss = new WebSocket("ws://10.0.0.34:40510");


// Variables
//Times Chatted
var chat_times = 0;
//Times Broadcast Received
var broad_times = 0;
//Room Name
var room_name = window.pathname;


//Set Title to Room Name
document.head.title = room_name

wss.onopen = function(evt) {
	console.log("Connection established!");
	var username = localStorage.getItem("username");
	//Send User Data
	wss.send(JSON.stringify({name: username, room: room_name}));
};

wss.onmessage = function(evt) {
	var u = JSON.parse(evt.data).user;
	var msg = JSON.parse(evt.data).msg;
	var color = JSON.parse(evt.data).color;
	var room = JSON.parse(evt.data).room;
	var username = u.name;
	if (u && msg && room == room_name) {
		if (username == "") {
			broad_times=broad_times+1;
			$("#chat").append('<h5 id="chat'+broad_times+'" class="broadcast" style="font-family: Arial, sans-serif; font-weight: bold; color: '+color+';">'+msg+"</h5>");
			console.log(`${msg}`);
		} else {
			chat_times=chat_times+1;
			$("#chat").append('<h5 id="chat'+username+chat_times+'" class="chat" style="font-family: Arial, sans-serif; font-weight: bold; color: rgb(105,105,105);">'+username+': '+msg+'</h5>');
			console.log(`${username}: ${msg}`);
		}
	}
};

// API Functions
window.MPC = {
	chat: {
		send(msg) {
			var username = localStorage.getItem("username");
			wss.send(JSON.stringify({"msg": msg, "user": JSON.stringify({"name": username})}));
			console.log(`Sent: ${msg}`);
		}
	},
	users: {
		join(user) {
			window.Emit = "MPC.users.join";
		},
		msg(user, message) {
			window.Emit = "MPC.users.msg";
			window.msg = {
				user: user,
				msg: message
			};
		}
	},
	event(key, callback) {
		if (key == window.Emit && key == "MPC.users.msg") {
			//Execute Function Callback
			callback(window.msg.user, window.msg.msg);
		}
		window.Emit == "";
	}
}

// Client Handling
function getKey(e)
{
    if (e.keyCode == 13) {
    	document.getElementById("chatBox").value = document.getElementById("chatBox").value.replace("\n", "");
    	window.MPC.chat.send(document.getElementById("chatBox").value);
    	document.getElementById("chatBox").value = "";
    }
}

document.getElementById("chatBox").onkeyup = getKey;

// User Events
MPC.event("MPC.users.join", (u) => {
	$("#names").append('<div class="name" style="background-color: rgb(135, 198, 238);">'+u.name+'</div>');
});