//By PBR, Seung Kim
// Group 11
// Communication Server For Green Corp
// Please feel free to tag your name and contribute

var express = require('./express');
var app = express();

var mongojs = require('mongojs')
var rovers = require('./rovers');
// var db = mongojs('green_corp', ['global']);

// var collection = db.collection('global');

// // JSON obj of a maptile. must be in ALL CAPS, as in enum value
//     {
//         "x":12,
//         "y":14,
//         "terrain": "SAND", // GRAVEL, SOIL, ROCK, SAND, NONE
//         "science": "CRYSTAL",  // RADIOACTIVE, ORGANIC, MINERAL, ARTIFACT, CRYSTAL, NONE
//     };


var map = {};

// Homepage with instructions
app.get('/', function (req, res) {
    res.sendFile('index.html');
});

// get Global Map
app.get('/api/global', function (req, res) {
    var apikey = req.header('greencorp-apikey');
    if (!apikey || apikey !== process.env.GREENCORP_537_APIKEY) {
        res.send(401, 'Unauthorized. You must have greencorp key to post');
    }
    else {
        res.send(mapToGlobal());
    }
})
;

// convert map object to global array
function mapToGlobal(science) {
    var key;
    var results = [];

    for (key in map) {

        if (map.hasOwnProperty(key)) {

            // if no parameter, just return the global map
            if (!science) {
                results.push(map[key]);

                // if science requested
            } else if (science) {

                // if all
                if (science === 'all') {
                    if (map[key].science !== 'NONE') {
                        results.push(map[key]);
                    }

                    // excavate or drill
                } else if (science === 'excavate') {
                    if ((map[key].terrain === 'SAND' || map[key].terrain === 'SOIL') && map[key].science !== 'NONE') results.push(map[key]);
                } else if (science === 'drill') {
                    if ((map[key].terrain === 'GRAVEL' || map[key].terrain === 'ROCK') && map[key].science !== 'NONE') results.push(map[key]);
                }
            }

        }
    }
    return results;
}

// post to global map
app.post('/api/global', function (req, res) {
    var tiles = req.body;

    var rovername = req.header('Rover-Name');
    var apikey = req.header('greencorp-apikey');
    var rover = rovers[rovername];

    if (!apikey || apikey !== process.env.GREENCORP_537_APIKEY) {
        res.send(401, 'Unauthorized. You must have greencorp key to post');
    } else {

        // validate that the data is an array
        if (tiles && tiles.constructor === Array) {
            tiles.forEach(function (tile) {

                // validate that data has all attributes and is in correct format
                if (validateTile(tile)) {
                    var key = tile.x + "/" + tile.y;

                    // if the tile exists in the map
                    if (map[key]) {

                        // if map has none, update it whatsoever
                        // TODO: check cases when the science is taken
                        if (map[key].science === 'NONE') {
                            map[key].science = tile.science;

                            // if map does have science in the tile,
                        }

                    } else {
                        map[key] = tile;
                    }

                }
            })
            res.send('OK');
        } else {
            res.send('Data must be an array');
        }

    }
    // for each tile, save to an object mapping by a key string, to minimize access time

});

// resets the data
app.get('/api/global/reset', function (req, res) {
    map = {};
    res.send("Data cleaned. Now you can do it but later you will require apikey");
});

// for debugging
app.get('/api/debug/mapping', function (req, res) {
    res.send(map)
});

// for getting the size of the json array
app.get('/api/global/size', function (req, res) {
    var global = mapToGlobal();
    var size = global.length;
    res.send(size.toString());
});

// for tutorial
app.get('/api/global/test', function (req, res) {
    var testmap = [
        {x: 1, y: 2, terrain: "GRAVEL", science: "CRYSTAL"},
        {x: 3, y: 4, terrain: "SAND", science: "ORGANIC"},
        {x: 5, y: 6, terrain: "SOIL", science: "MINERAL"},
        {x: 7, y: 8, terrain: "SOIL", science: "RADIOACTIVE"},
        {x: 9, y: 10, terrain: "ROCK", science: "ARTIFACT"},
        {x: 11, y: 12, terrain: "NONE", science: "NONE"}
    ]
    res.send(testmap);
});

// option choices:
// /science/all, /science/drill, /science/excavate
app.get('/api/science/:option', function (req, res) {
    var param = req.params.option;
    if (param === 'all' || param === 'drill' || param === 'excavate')
        res.send(mapToGlobal(req.params.option));
    else res.send('api/science/:parameter must be either \'all\', \'drill\', or \'excavate\' ');
});

app.get('/api/coord/:x/:y', function (req, res) {
    var x = req.params.x;
    var y = req.params.y;
    var key = x + '/' + y;
    var result = (map[key] === undefined) ? 'none' : map[key];
    res.send(result);
});

app.get('/api/roverinfo', function (req, res) {
    res.send(rovers);
});

// object validator
function validateTile(tile) {
    if (!isInt(tile.x) || !isInt(tile.y)) return false;

    // validate science
    // validate terrain

    return true;
}

// check if coordinate is an integer
function isInt(value) {
    var x;
    if (isNaN(value)) {
        return false;
    }
    x = parseFloat(value);
    return (x | 0) === x;
}


// **************** deprecated ***************


//Update: May 2nd 3:42AM - Might have to rework and rethink this section  and next because the JSON might return the
//science type now. the call should remain the same.


//If the user has two tools, this is what they will use.
//yes there is another way to have done this but its cool for now.
// app.get('/:vehicle/both', function (req, res) {
//     //if being requested by a wheel
//
//     switch (req.params.vehicle) {
//
//         case "wheel":
//             console.log("User requested results of wheels - 2 tools");
//             scienceDB.find({"terrain": {$in: ['soil', 'gravel']}, "stillExists": true}).toArray(function (err, docs) {
//                 if (err) throw err;
//                 (res.send(docs));
//             });
//             break;
//
//         case "walker":
//             console.log("User requested results of walker- 2 tools");
//             scienceDB.find({
//                 "terrain": {$in: ['rock', 'gravel', 'soil']},
//                 "stillExists": true
//             }).toArray(function (err, docs) {
//                 if (err) throw err;
//                 (res.send(docs));
//             });
//             break;
//
//         case "tread":
//             console.log("User requested results of tread- 2 tools");
//             scienceDB.find({
//                 "terrain": {$in: ['sand', 'gravel', 'soil']},
//                 "stillExists": true
//             }).toArray(function (err, docs) {
//                 if (err) throw err;
//                 (res.send(docs));
//             });
//             break;
//     }
//
// }); // 2 tool api end.
//
//
// //If the user only has one tool, this is the API call they will use.
//
// app.get('/:vehicle/:tool', function (req, res) {
//     //if being requested by a wheel
//
//     var _requestTerrain = "";
//     switch (req.params.vehicle) {
//
//         case "wheel":
//             console.log("User requested results of wheels");
//             if (req.params.tool === "drill")
//                 _requestTerrain = "gravel";
//             else if (req.params.tool === "harvester")
//                 _requestTerrain = "soil";
//             scienceDB.find({"terrain": _requestTerrain, "stillExists": true}).toArray(function (err, docs) {
//                 if (err) throw err;
//                 (res.send(docs));
//             });
//             break;
//
//         case "walker":
//             console.log("User requested results of walker");
//             if (req.params.tool === "drill")
//                 _requestTerrain = "gravel";
//             else if (req.params.tool === "harvester")
//                 _requestTerrain = "soil";
//             scienceDB.find({
//                 "terrain": {$in: ['rock', _requestTerrain]},
//                 "stillExists": true
//             }).toArray(function (err, docs) {
//                 if (err) throw err;
//                 (res.send(docs));
//             });
//             break;
//
//         case "tread":
//             console.log("User requested results of tread");
//             if (req.params.tool === "drill")
//                 _requestTerrain = "gravel";
//             else if (req.params.tool === "harvester")
//                 _requestTerrain = "soil";
//             scienceDB.find({
//                 "terrain": {$in: ['sand', _requestTerrain]},
//                 "stillExists": true
//             }).toArray(function (err, docs) {
//                 if (err) throw err;
//                 (res.send(docs));
//             });
//             break;
//     }
// }); // 1 tool api end.
//
//
// ////
// ////POST method for scouts.
// ////
// app.post("/scout", function (req, res) {
//     //Method will check if it's there
//
//     var data_ = {};
//     data_.x = req.body.x;
//     data_.y = req.body.y;
//     data_.terrain = req.body.terrain;
//     data_.science = req.body.science;
//     data_.stillExists = req.body.stillExists;
//     //first query if it's there.
//     scienceDB.find({"x": req.body.x, "y": req.body.y}, function (err, docs) {
//         if (err) throw err;
//         console.log(docs);
//         if (docs.length > 0) {
//             console.log("Science already exists in database");
//         }
//
//         else {
//             console.log("inserting the following data to databse:");
//             console.log(data_);
//             scienceDB.insert(data_, function (err, docs) {
//                 if (err) {
//                     throw err;
//                 }
//                 res.send(docs);
//                 console.log("science succcessfully inserted");
//             });
//         }
//         ;
//     });
// }); //post end.
//
// //// TODO: Implement a POST method for harvester/drillers that changes the value
// /// of a harvested science [by x, and y] and changes it's stillExists condition to 'false'
// //
// // Update May 2nd, 10:13pm - it works but requires more testing.
// //possible response lag but the change is instant.
//
// //Todo: add a check to make sure users are harvesting with the science with the right tool.
// app.post("/gather", function (req, res) {
//     //Method will check if it's there
//
//     var data_ = {};
//     data_.x = req.body.x;
//     data_.y = req.body.y;
//
//     console.log("recieving gather post request with data:\n" + req.body);
//     //first query if it's there.
//     scienceDB.findAndModify({
//         query: {"x": req.body.x, "y": req.body.y, "stillExists": true},
//         update: {$set: {"stillExists": false}},
//     }, function (err, docs) {
//         if (err) throw err;
//         if (docs) {
//             console.log("about to change update the following document: ");
//             console.log(docs);
//             //might need a response to confirm.
//         }
//
//         else {
//             console.log("bad request, either science not in database or already harvested");
//         }
//         ;
//     });
// }); //post end.
//
//
// TODO: Update methods for scanning squares with sciences to make sure they are still there
// or to notify that they no longer exist if other team grabs them.
//
//
// I'm still debating whether to have the server send back the coordinates in order or let the client do that.
// because only the client will know how far it really is depending on their A* search based on their position
// and surronding


app.listen(3000);

console.log("Express app running on port 3000");

module.exports = app;