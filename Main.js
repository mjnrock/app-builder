const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const expressWS = require("express-ws")(express());
const app = expressWS.app;

const PORT = 1999;
const STDIN = process.openStdin();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(express.static(path.join(__dirname, "public")));

app.ws("/ws", function (client, req) {
	console.log(`[CLIENT CONNECTED]: { Timestamp: ${Date.now()}, IP: ${req.connection.remoteAddress} }`);

	client.on("message", function(msg) {
		try {
			const packet = JSON.parse(msg);

			//!	Debugging
			// console.log(client._socket.address());
			// console.log(client.clients);
			console.log(`[PACKET RECEIVED]: { Timestamp: ${Date.now()}, IP: ${req.connection.remoteAddress} }`);
		} catch (e) {
			console.log("[PACKET FAILURE]: Message could not be extracted");
			console.log(e);
		}
	});

	client.on("close", function() {
		console.log(`[CLIENT DISCONNECTED]: { Timestamp: ${Date.now()}, IP: ${req.connection.remoteAddress} }`);
	});
});

app.listen(PORT, () => {
	console.log(`App Builder API is now listening on port: ${PORT}`);
});

//?		get Object.keys($.Common.Entity.EntityManager.Entities)
STDIN.addListener("data", function(d) {
	let args = d.toString().trim().replace(/^\s+|\s+$/g, '').split(" ");
	if(args[0] === "get") {
		if(args[1] !== null && args[1] !== void 0) {
			try {
				let obj = args[1].replace("$", "FuzzyKnights");
				console.log(util.inspect(eval(obj)));
			} catch (e) {
				console.log("[WARNING]: Invalid command.");
			}
		}
	} else if(args[0] === "exit" || args[0] === "stop") {
		//  Kill the current Node instance
		process.exit();
	}
});