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

// const config = {
// 	user: "staxpax",
// 	password: "staxpax",
// 	server: "localhost",
// 	database: "StaxPax"
// };
// const TSQLPool = new mssql.ConnectionPool(config)
// 	.connect()
// 	.then(pool => {
// 		console.log(`Connected to: [Server: ${ config.server }, Database: ${ config.database }]`);

// 		return pool;
// 	})
// 	.catch(err => console.log("Database Connection Failed! Bad Config: ", err));

app.get("/api", async (req, res) => {
	try {
		const pool = await TSQLPool;
		const result = await pool.request()
        	.input("s", mssql.VarChar, req.query.s)
			.query("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA=@s");

		res.json(result.recordset);
	} catch (e) {
		res.status(500);
		res.send(e.message);
	}
});
app.get("/api/:schema", async (req, res) => {
	try {
		const pool = await TSQLPool;
		const result = await pool.request()
        	.input("s", mssql.VarChar, req.params.schema)
			.query(`
				SELECT
					cols.SchemaName,
					cols.TableName,
					cols.ColumnName,
					cols.OrdinalPosition,
					cols.DataType,
					cols.DataTypeLength,
					
					fkcols.FKSchemaName,
					fkcols.FKTableName,
					fkcols.FKColumnName,
					fkcols.FKOrdinalPosition,
					fkcols.FKDataType,
					fkcols.FKDataTypeLength
				FROM
					(
						SELECT
							s.name AS SchemaName,
							o.name AS TableName,
							c.name AS ColumnName,
							c.colid AS OrdinalPosition,
							UPPER(t.name) AS DataType,
							c.[length] AS DataTypeLength
						FROM
							sysobjects o
							INNER JOIN syscolumns c
								ON o.id = c.id
							INNER JOIN systypes t
								ON c.xtype = t.xtype
							INNER JOIN sys.tables tbl
								ON o.id = tbl.object_id
							INNER JOIN sys.schemas s
								ON tbl.schema_id = s.schema_id
						WHERE
							o.xtype = 'U'
							AND t.[status] = 0
					) cols
					LEFT JOIN (
						SELECT
							s.name AS SchemaName,
							OBJECT_NAME(f.parent_object_id) AS TableName,
							COL_NAME(fc.parent_object_id, fc.parent_column_id) AS ColumnName,
							c.column_id AS OrdinalPosition,
							UPPER(ty.name) AS DataType,
							c.max_length AS DataTypeLength,
							fks.name AS FKSchemaName,
							OBJECT_NAME(f.referenced_object_id) AS FKTableName,
							COL_NAME(fc.referenced_object_id, fc.referenced_column_id) AS FKColumnName,		
							fkc.column_id AS FKOrdinalPosition,	
							UPPER(fkty.name) AS FKDataType,
							fkc.max_length AS FKDataTypeLength,
							delete_referential_action_desc AS FKDeleteAction,
							update_referential_action_desc AS FKUpdateAction
						FROM
							sys.foreign_keys f
							INNER JOIN sys.foreign_key_columns fc
								ON f.object_id = fc.constraint_object_id
							INNER JOIN sys.tables t
								ON f.parent_object_id = t.object_id
							INNER JOIN sys.schemas s
								ON t.schema_id = s.schema_id
							INNER JOIN sys.columns c
								ON t.object_id = c.object_id
								AND c.column_id = fc.parent_column_id
							INNER JOIN sys.types ty
								ON c.user_type_id = ty.user_type_id
								
							INNER JOIN sys.tables fkt
								ON fc.referenced_object_id = fkt.object_id
							INNER JOIN sys.schemas fks
								ON fkt.schema_id = fks.schema_id
							INNER JOIN sys.columns fkc
								ON fkt.object_id = fkc.object_id
								AND fkc.column_id = fc.referenced_column_id
							INNER JOIN sys.types fkty
								ON fkc.user_type_id = fkty.user_type_id
					) fkcols
						ON cols.SchemaName = fkcols.SchemaName
						AND cols.TableName = fkcols.TableName
						AND cols.ColumnName = fkcols.ColumnName
				WHERE
					cols.SchemaName=@s
				ORDER BY
					cols.TableName,
					cols.OrdinalPosition,
					fkcols.FKOrdinalPosition
			`);

		let maxDepth = req.query.md != null && req.query.md !== void 0 ? req.query.md : 5;
		let recur = (columns, depth) => {
			let tag = columns.map(c => {
				if(c.FKColumnName === null || depth > maxDepth) {
					let dataType = +TSQL.Enum.DataType[c.DataType.toUpperCase()],
						clazz = PTO.Enum.TagType.GetClass(dataType),
						colTag = new clazz(c.ColumnName);
				
					colTag.SetOrdinality(+c.OrdinalPosition);

					return colTag;
				} else {
					let ftbls = result.recordset.filter(r => r.SchemaName === c.FKSchemaName && r.TableName === c.FKTableName),
						ctag = new PTO.Tag.TagCompound(c.ColumnName);
		
					ctag.SetOrdinality(+c.OrdinalPosition);
					
					let children = recur(ftbls, depth + 1);
					children.forEach(ch => ctag.AddTag(ch));
					
					return ctag;
				}
			});			

			return tag;
		};


		let tag = new PTO.Tag.TagCompound(req.params.schema),
			tables = [];
		result.recordset.forEach(r => {
			if(!tables.includes(r.TableName)) {
				tables.push(r.TableName);
			}
		});
		tables.forEach(t => {
			let ftbls = result.recordset.filter(r => r.TableName === t),
				children = recur(ftbls, 1),
				ctag = new PTO.Tag.TagCompound(t);

			children.forEach(c => ctag.AddTag(c));
			tag.AddTag(ctag);
		});
		
		res.json(tag);

		//! Move the "tag" into a larger shape, like below
		// let Mutator = PTO.Mutator.Mutator,	// For the GenerateMutator "extends"
		// 	mutator = eval(`(${ PTO.Mutator.MutatorFactory.GenerateMutator(tag) })`),
		// 	tableModel = new TSQL.TableModel(table, mutator);
			
		// let mut = new mutator();
		// records.forEach((r, i) => {
		// 	r.SetGetter(`Get${ mut.SearchSchema("Key", r.GetName()).SafeKey }`);
		// 	r.SetSetter(`Set${ mut.SearchSchema("Key", r.GetName()).SafeKey }`);

		// 	tableModel.AddColumn(r.GetName(), r);
		// });

		// res.json(tableModel);

		// //*	ret Shape
		// // {
		// // 	"Label": "UniverseID",
		// // 	"DataType": "INT",
		// // 	"Data": {
		// // 		"Tag": {
		// // 			"Type": 1,
		// // 			"Key": "UniverseID",
		// // 			"Value": [],
		// // 			"Ordinality": 1
		// // 		},
		// // 		"Getter": "GetUniverseID",
		// // 		"Setter": "SetUniverseID"
		// // 	}
		// // }
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

const TestCase = () => {
	let tags = [];
	tags.push(new PTO.Tag.TagString(1, "cats"));
	tags.push(new PTO.Tag.TagInt(2, [1, 2, 3, 4]));

	// for(let i = 0; i < 2; i++) {
	// 	tags.push(new PTO.Tag.TagString(i, "cats"));
	// }

	
	//?	General
	// console.log("Copy: ", PTO.Utility.General.Copy(tags[0], 5));
	console.log("Union: ", PTO.Utility.General.Union("test", ...tags));

	//?	Text
	// console.log("Concat: ", PTO.Utility.Text.Concat("pre", tags[0], "app", false, tags[1]));
	// console.log("Concat: ", PTO.Utility.Text.Concat("pre", tags[0], "app", true, tags[1]));
	// console.log("Concat: ", PTO.Utility.Text.Concat("pre", tags[0], "app", true, tags[1]).GetValues());
	// console.log("Match: ", PTO.Utility.Text.Match("cat", tags[0], false));
	// console.log("Match: ", PTO.Utility.Text.Match("cat", tags[0], true));
	// console.log("Equals: ", PTO.Utility.Text.Equals(tags[0], tags[1], false));
	// console.log("Equals: ", PTO.Utility.Text.Equals(tags[0], tags[1], true));
	// console.log("Equals: ", PTO.Utility.Text.Equals(tags[0], tags[1], true, true));
	// console.log("Interpolate: ", PTO.Utility.Text.Interpolate("This is {0} a test {1} for you", ...tags, true));
	// console.log("Interpolate: ", PTO.Utility.Text.Interpolate("This is {0} a test {1} for you", ...tags));
	// console.log("Interpolate: ", PTO.Utility.Text.Interpolate("This is {0} a test {1} for you", ...tags, true).GetValues());

	// //?	Mathematics
	// console.log("ToSingleValue: ", PTO.Utility.Mathematics.ToSingleValue(tags[0]));
	// console.log("ToSingleValue: ", PTO.Utility.Mathematics.ToSingleValue(tags[0], true));
	// console.log("Add: ", PTO.Utility.Mathematics.Add(...tags));
	// console.log("Subtract: ", PTO.Utility.Mathematics.Subtract(...tags));
	// console.log("Multiply: ", PTO.Utility.Mathematics.Multiply(...tags));
	// console.log("Divide: ", PTO.Utility.Mathematics.Divide(...tags));
	// console.log("Power: ", PTO.Utility.Mathematics.Power(tags[0], tags[1]));
	// console.log("ToPercent: ", PTO.Utility.Mathematics.ToPercent(tags[0]));
	// console.log("Count: ", PTO.Utility.Mathematics.Count(tags[0]));
	// console.log("Count: ", PTO.Utility.Mathematics.Count(tags[0], tags[1]));
	// console.log("Calculate: ", PTO.Utility.Mathematics.Calculate("1 + ({0} * {1})", ...tags));
;}

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
	} else if(args[0] === "test" || args[0] === "t") {
		TestCase()
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