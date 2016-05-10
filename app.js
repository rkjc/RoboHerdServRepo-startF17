//By PBR 
// Group 11
//Communication Server For Green Corp
var express = require("express");
var bodyParser = require("body-parser");
var mongo= require("mongodb");
var http=require('http');
var app = express();

var mongojs = require('mongojs')
var db = mongojs('test', ['test']);
var scienceDB = db.collection('test');


//This is an example reminder of how the JSON objects look:
//case sensitive
var science=
    //Sample Data
    {
        "x":12,
        "y":14,
        "terrain": "sand", // gravel, soild, rock,
        "science": "crystal",  //organic, radioactive, mineral
        "stillExists": true  //should be set to true when first seen by sensors
    };
    
//Ex 2:
/* 
{"x": 77, "y": 11, "terrain": "gravel", "science": "organic", "stillExists": true} 
*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
	console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
	next();
});

	//Instructions incase someone hits the :3000 server without api.
 app.get('/',function(req,res){
 	res.writeHead(200,{"Content-Type":"text"});
 	res.write("Ok..., type a / then a vehicle type (wheel, walker, tread followed by a /and a tool name you have(harvester or drill).\n (replace 192.168.1.222 with localhost if testing server on your own machine)  \n For example: 192.168.1.222:3000/walker/harvester \n If you have two tools type 'both' as the tool, in this format: 192.168.1.222:3000/tread/both \n if you're a scout, send POST JSON requests to http:://192.168.1.222:3000/scout \n If you are testing you can use localhost:3000/globalMap for now. \nP.S. Everything is Case Sensitive, user lowerCase. \n");
 	res.end();

 });


//Update: May 2nd 3:42AM - Might have to rework and rethink this section  and next because the JSON might return the 
//science type now. the call should remain the same.


//If the user has two tools, this is what they will use.
//yes there is another way to have done this but its cool for now.
app.get('/:vehicle/both', function(req,res){
	//if being requested by a wheel

	switch(req.params.vehicle){

		case "wheel":
			console.log("User requested results of wheels - 2 tools");
			 	scienceDB.find({"terrain": {$in:['soil','gravel']}, "stillExists": true}).toArray(function(err,docs){
	 		if(err) throw err;
	 		(res.send(docs));
	 		});
		break;

		case "walker":
			console.log("User requested results of walker- 2 tools");
			scienceDB.find({"terrain": {$in: ['rock', 'gravel','soil']}, "stillExists": true}).toArray(function(err,docs){
	 		if(err) throw err;
	 		(res.send(docs));
	 		});
		break;

		case "tread":
		console.log("User requested results of tread- 2 tools");
		scienceDB.find({"terrain": {$in: ['sand', 'gravel','soil']}, "stillExists": true}).toArray(function(err,docs){
	 		if(err) throw err;
	 		(res.send(docs));
	 		});
		break;
	}

 }); // 2 tool api end.



//If the user only has one tool, this is the API call they will use.

app.get('/:vehicle/:tool', function(req,res){
	//if being requested by a wheel

	var _requestTerrain="";
	switch(req.params.vehicle){

		case "wheel":
			console.log("User requested results of wheels");
			if(req.params.tool==="drill")
				_requestTerrain="gravel";
			else if(req.params.tool==="harvester")
				_requestTerrain="soil";
			 	scienceDB.find({"terrain": _requestTerrain, "stillExists": true}).toArray(function(err,docs){
	 		if(err) throw err;
	 		(res.send(docs));
	 		});
		break;

		case "walker":
			console.log("User requested results of walker");
			if(req.params.tool==="drill")
				_requestTerrain="gravel";
			else if(req.params.tool==="harvester")
				_requestTerrain="soil";
			scienceDB.find({"terrain": {$in: ['rock', _requestTerrain]}, "stillExists": true}).toArray(function(err,docs){
	 		if(err) throw err;
	 		(res.send(docs));
	 		});
		break;

		case "tread":
		console.log("User requested results of tread");
		if(req.params.tool==="drill")
				_requestTerrain="gravel";
			else if(req.params.tool==="harvester")
				_requestTerrain="soil";
		scienceDB.find({"terrain": {$in: ['sand', _requestTerrain]}, "stillExists": true}).toArray(function(err,docs){
	 		if(err) throw err;
	 		(res.send(docs));
	 		});
		break;
	}
 }); // 1 tool api end.



//Global Map - This Will Also Show Gathered Science, for future debugging.
app.get('/globalMap', function(req,res){
	scienceDB.find().toArray(function(err,docs){
		if(err) throw err;
		(res.send(docs));
	});
});


	 ////
	////POST method for scouts.
   ////
app.post("/scout", function(req, res) {
		//Method will check if it's there
		
	var data_={};
	data_.x=req.body.x;
	data_.y=req.body.y;
	data_.terrain=req.body.terrain;
	data_.science=req.body.science;
	data_.stillExists=req.body.stillExists;
	//first query if it's there.
	scienceDB.find({"x":req.body.x,"y":req.body.y},function(err,docs){
	 	if(err) throw err;
	 	console.log(docs);
		 	if(docs.length>0){
		 		console.log("Science already exists in database");
		 	}

		 	else{
		 		console.log("inserting the following data to databse:");
				console.log(data_);
				scienceDB.insert(data_,function(err,docs){
					 if(err) { throw err; }
					 	res.send(docs);
					 	console.log("science succcessfully inserted");
				 	});
			};	
	});
}); //post end.

//// TODO: Implement a POST method for harvester/drillers that changes the value
/// of a harvested science [by x, and y] and changes it's stillExists condition to 'false'
//
// Update May 2nd, 10:13pm - it works but requires more testing.
//possible response lag but the change is instant.

//Todo: add a check to make sure users are harvesting with the science with the right tool.
app.post("/gather", function(req, res) {
		//Method will check if it's there

	var data_={};
	data_.x=req.body.x;
	data_.y=req.body.y;

	console.log("recieving gather post request with data:\n"+req.body);
	//first query if it's there.
	scienceDB.findAndModify({
		query: {"x":req.body.x,"y":req.body.y,"stillExists":true},
		update: {$set: {"stillExists":false} },
		},function(err,docs){
	 		if(err) throw err;
		 		if(docs){
		 			console.log("about to change update the following document: ");
		 			console.log(docs);
		 			//might need a response to confirm.
		 		}

		 		else{
		 			console.log("bad request, either science not in database or already harvested");
				};	
	});
}); //post end.

app.post("/testPost", function(req, res) {
	console.log("The post sent here was:\n");
	console.log(req.body)
	
});

//TODO: Update methods for scanning squares with sciences to make sure they are still there
//or to notify that they no longer exist if other team grabs them.


//I'm still debating whether to have the server send back the coordinates in order or let the client do that.
//because only the client will know how far it really is depending on their A* search based on their position 
//and surronding


app.listen(3000);

console.log("Express app running on port 3000");

module.exports = app;