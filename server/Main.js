const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const expressWS = require("express-ws")(express());
const app = expressWS.app;

const PORT = 1999;
const STDIN = process.openStdin();


const mssql = require("mssql");

import PTO from "./lib/pto/package";
import TSQL from "./data-source/tsql/package";
import { TableModel } from "./data-source/tsql/TableModel";

const config = {
	user: "staxpax",
	password: "staxpax",
	server: "localhost",
	database: "StaxPax"
};
const TSQLPool = new mssql.ConnectionPool(config)
	.connect()
	.then(pool => {
		console.log(`Connected to: [Server: ${ config.server }, Databse: ${ config.database }]`);

		return pool;
	})
	.catch(err => console.log("Database Connection Failed! Bad Config: ", err));

app.get("/api", async (req, res) => {
	try {
		const pool = await TSQLPool;
		console.log(req.query);
		const result = await pool.request()
        	.input("s", mssql.VarChar, req.query.s)
			.query("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA=@s");

		res.json(result.recordset);
	} catch (e) {
		res.status(500);
		res.send(e.message);
	}
});
app.get("/api/:schema/:table", async (req, res) => {
	try {
		const pool = await TSQLPool;
		console.log(req.params);
		const result = await pool.request()
        	.input("s", mssql.VarChar, req.params.schema)
        	.input("t", mssql.VarChar, req.params.table)
			// .query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=@s AND TABLE_NAME=@t");
			.query("SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, ORDINAL_POSITION, COLUMN_DEFAULT, IS_NULLABLE, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, NUMERIC_PRECISION, DATETIME_PRECISION FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=@s AND TABLE_NAME=@t");

		let tag = new PTO.Tag.TagCompound(req.params.table),
			table = result.recordset[0]["TABLE_NAME"],
			records = result.recordset.map(r => {

			let dataType = +TSQL.Enum.DataType[r["DATA_TYPE"].toUpperCase()],
				clazz = PTO.Enum.TagType.GetClass(dataType),
				colTag = new clazz(r["COLUMN_NAME"]);
			
			colTag.SetOrdinality(+r["ORDINAL_POSITION"]);
			tag.AddTag(colTag);

			return new TSQL.TableColumn(
				r["COLUMN_NAME"],
				r["DATA_TYPE"].toUpperCase(),
				+r["ORDINAL_POSITION"],

				colTag
			);
		});

		let Mutator = PTO.Mutator.Mutator,	// For the GenerateMutator "extends"
			mutator = eval(`(${ PTO.Mutator.MutatorFactory.GenerateMutator(tag) })`),
			mut = new mutator(),
			tableModel = new TSQL.TableModel(table, mut);
			
		records.forEach((r, i) => {
			r.SetGetter(`Get${ mut.SearchSchema("Key", r.GetName()).SafeKey }`);
			r.SetSetter(`Set${ mut.SearchSchema("Key", r.GetName()).SafeKey }`);

			tableModel.AddColumn(r.GetName(), r);
		});

		//*	ret Shape
		// {
		// 	"Label": "UniverseID",
		// 	"DataType": "INT",
		// 	"Data": {
		// 		"Tag": {
		// 			"Type": 1,
		// 			"Key": "UniverseID",
		// 			"Value": [],
		// 			"Ordinality": 1
		// 		},
		// 		"Getter": "GetUniverseID",
		// 		"Setter": "SetUniverseID"
		// 	}
		// }

		res.json(tableModel);
	} catch (e) {
		res.status(500);
		res.send(e.message);
	}
});



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