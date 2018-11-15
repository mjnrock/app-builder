const fs = require("fs");
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
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
	next();
});
app.use(express.static(path.join(__dirname, "public")));

// fs.writeFile('./public/mynewfile1.txt', 'Hello content!', function (err) {
// fs.appendFile('./public/mynewfile1.txt', 'Hello content!', function (err) {
// 	if (err) throw err;
// 	console.log('Saved!');
// }); 

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


//	https://vmokshagroup.com/blog/building-restful-apis-using-node-js-express-js-and-ms-sql-server/
// //Initiallising connection string
// var dbConfig = {
//     user:  “<dbUserName>”,
//     password: “<dbPassword>”,
//     server: “<dbHost_URL>”,
//     database:” <dbName>”
// };

// //Function to connect to database and execute query
// var  executeQuery = function(res, query){             
//      sql.connect(dbConfig, function (err) {
//          if (err) {   
//                      console.log("Error while connecting database :- " + err);
//                      res.send(err);
//                   }
//                   else {
//                          // create Request object
//                          var request = new sql.Request();
//                          // query to the database
//                          request.query(query, function (err, res) {
//                            if (err) {
//                                       console.log("Error while querying database :- " + err);
//                                       res.send(err);
//                                      }
//                                      else {
//                                        res.send(res);
//                                             }
//                                });
//                        }
//       });           
// }

// //GET API
// app.get("/api/user", function(req , res){
//                 var query = "select * from [user]";
//                 executeQuery (res, query);
// });

// //POST API
//  app.post("/api/user", function(req , res){
//                 var query = "INSERT INTO [user] (Name,Email,Password) VALUES (req.body.Name,req.body.Email,req.body.Password”);
//                 executeQuery (res, query);
// });

// //PUT API
//  app.put("/api/user/:id", function(req , res){
//                 var query = "UPDATE [user] SET Name= " + req.body.Name  +  " , Email=  " + req.body.Email + "  WHERE Id= " + req.params.id;
//                 executeQuery (res, query);
// });

// // DELETE API
//  app.delete("/api/user /:id", function(req , res){
//                 var query = "DELETE FROM [user] WHERE Id=" + req.params.id;
//                 executeQuery (res, query);
// });


//	http://www.javascriptpoint.com/access-mssql-nodejs-tutorial/