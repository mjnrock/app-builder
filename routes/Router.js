const DAILY_MILLISECONDS = 8.64e+7;

const router = (App, Drivers) => {
	// const DB = new Neo4j(Drivers.Neo4j);

	App.post("/feed/:feed/w", function (req, res) {
		let feed = req.params.feed,
			author = req.body.author,
			payload = req.body.payload,
			timestamp = Date.now();

		DB.SendJSON(res, ...POSTFeedPost(DB, feed, author, payload, timestamp));
	});
	App.get("/feed/:feed/r", function (req, res) {
		let feed = req.params.feed,
			l = +req.query.l || 50;	// Limit

		DB.SendJSON(res, ...GETFeed(DB, feed, l));
	});

	App.get("/validate", function (req, res) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.status(200).send("This is a validation message from the Hangtime Graph API");
	});

	App.ws("/ws", function (client, req) {
		console.log(`[CLIENT CONNECTED]: { Timestamp: ${Date.now()}, IP: ${req.connection.remoteAddress} }`);
		client.UUID = FuzzyKnights.Common.Utility.Functions.NewUUID();
	
		//TODO Rewrite these kinds of packets to a special condition on the client, as the PacketManager won't be loaded yet on the Client and thus throws an error
		let _pkt = new FuzzyKnights.Common.Message.PlayerConnectMessage(client.UUID);
		client.send(JSON.stringify(_pkt));
	
		client.on("message", function(msg) {
			try {
				const packet = JSON.parse(msg);
	
				//!	Debugging
				// console.log(client._socket.address());
				// console.log(client.clients);
				console.log(`[PACKET RECEIVED]: { Timestamp: ${Date.now()}, IP: ${req.connection.remoteAddress} }`);
	
				if(packet["Message"] !== null && packet["Message"] !== void 0) {
					FuzzyKnights.Common.Message.Packet.PacketManager.ExtractMessage(packet);
				}
			} catch (e) {
				console.log("[PACKET FAILURE]: Message could not be extracted");
				console.log(e);
			}
		});
	
		client.on("close", function() {
			console.log(`[CLIENT DISCONNECTED]: { Timestamp: ${Date.now()}, IP: ${req.connection.remoteAddress} }`);
		});
	});
};

//TODO Move this to a class so that the DB and/or Drivers can be readily passed to it
function GETFeed(DB, feed, limit = 250) {
	return DB.Basic("neo4j", "password", [
		`MATCH (m:Message)`,
		`WHERE m.Timestamp >= ${Date.now() - 2 * DAILY_MILLISECONDS}`,		// Minus (exactly) 48 hours
		`RETURN m`,
		`ORDER BY m.Timestamp ASC`,
		`LIMIT $limit`
	], {
		limit: limit
	});
}

//TODO Move this to a class so that the DB and/or Drivers can be readily passed to it
function POSTFeedPost(DB, feed, author, payload, timestamp) {
	return DB.Basic("neo4j", "password", [
		`MERGE (m:Message {Author: $author, Payload: $payload, Timestamp: $timestamp})`,	// MERGE here with timestamp binding for pseudo idempotency
		`RETURN m`
	], {
		author: author,
		payload: payload,
		timestamp: timestamp
	})
}

export default router;