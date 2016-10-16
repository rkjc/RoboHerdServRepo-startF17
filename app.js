//By PBR, Sam Kim
// Group 11
// Communication Server For Green Corp
// Please feel free to tag your name and contribute

var express = require('./express');
var app = express();

var mongojs = require('mongojs')
var rovers = require('./rovers');
var utils = require('./utils');
var enums = require('./enums');
// // JSON obj of a maptile. must be in ALL CAPS, as in enum value
//     {
//         "x":12,
//         "y":14,
//         "terrain": "SAND", // GRAVEL, SOIL, ROCK, SAND, NONE
//         "science": "CRYSTAL",  // RADIOACTIVE, ORGANIC, MINERAL, ARTIFACT, CRYSTAL, NONE
//     };


var map = [{"f":11,"science":"NONE","x":18,"y":2,"terrain":"SOIL"},{"f":11,"science":"NONE","x":19,"y":2,"terrain":"SOIL"},{"f":11,"science":"NONE","x":20,"y":2,"terrain":"SOIL"},{"f":11,"science":"NONE","x":21,"y":2,"terrain":"SOIL"},{"f":11,"science":"NONE","x":22,"y":2,"terrain":"SOIL"},{"f":11,"science":"NONE","x":23,"y":2,"terrain":"SOIL"},{"f":11,"science":"NONE","x":24,"y":2,"terrain":"ROCK"},{"f":11,"science":"NONE","x":18,"y":3,"terrain":"SOIL"},{"f":11,"science":"NONE","x":19,"y":3,"terrain":"SOIL"},{"f":11,"science":"NONE","x":20,"y":3,"terrain":"SOIL"},{"f":11,"science":"NONE","x":21,"y":3,"terrain":"SOIL"},{"f":11,"science":"NONE","x":22,"y":3,"terrain":"SOIL"},{"f":11,"science":"NONE","x":23,"y":3,"terrain":"SOIL"},{"f":11,"science":"NONE","x":24,"y":3,"terrain":"SOIL"},{"f":11,"science":"NONE","x":18,"y":4,"terrain":"SOIL"},{"f":11,"science":"NONE","x":19,"y":4,"terrain":"SOIL"},{"f":11,"science":"NONE","x":20,"y":4,"terrain":"SOIL"},{"f":11,"science":"NONE","x":21,"y":4,"terrain":"SOIL"},{"f":11,"science":"NONE","x":22,"y":4,"terrain":"SOIL"},{"f":11,"science":"NONE","x":23,"y":4,"terrain":"SOIL"},{"f":11,"science":"NONE","x":24,"y":4,"terrain":"SOIL"},{"f":11,"science":"NONE","x":18,"y":5,"terrain":"SOIL"},{"f":11,"science":"NONE","x":19,"y":5,"terrain":"SOIL"},{"f":11,"science":"NONE","x":20,"y":5,"terrain":"SOIL"},{"f":11,"science":"NONE","x":21,"y":5,"terrain":"SOIL"},{"f":11,"science":"NONE","x":22,"y":5,"terrain":"SOIL"},{"f":11,"science":"NONE","x":23,"y":5,"terrain":"SOIL"},{"f":11,"science":"NONE","x":24,"y":5,"terrain":"SOIL"},{"f":11,"science":"NONE","x":18,"y":6,"terrain":"SOIL"},{"f":11,"science":"NONE","x":19,"y":6,"terrain":"SOIL"},{"f":11,"science":"NONE","x":20,"y":6,"terrain":"SOIL"},{"f":11,"science":"NONE","x":21,"y":6,"terrain":"SOIL"},{"f":11,"science":"NONE","x":22,"y":6,"terrain":"SOIL"},{"f":11,"science":"NONE","x":23,"y":6,"terrain":"SOIL"},{"f":11,"science":"NONE","x":24,"y":6,"terrain":"SOIL"},{"f":11,"science":"NONE","x":18,"y":7,"terrain":"SOIL"},{"f":11,"science":"NONE","x":19,"y":7,"terrain":"SOIL"},{"f":11,"science":"NONE","x":20,"y":7,"terrain":"SOIL"},{"f":11,"science":"NONE","x":21,"y":7,"terrain":"SOIL"},{"f":11,"science":"NONE","x":22,"y":7,"terrain":"SOIL"},{"f":11,"science":"NONE","x":23,"y":7,"terrain":"SOIL"},{"f":11,"science":"NONE","x":24,"y":7,"terrain":"SOIL"},{"f":11,"science":"NONE","x":18,"y":8,"terrain":"SOIL"},{"f":11,"science":"NONE","x":19,"y":8,"terrain":"SOIL"},{"f":11,"science":"NONE","x":20,"y":8,"terrain":"SOIL"},{"f":11,"science":"NONE","x":21,"y":8,"terrain":"SOIL"},{"f":11,"science":"NONE","x":22,"y":8,"terrain":"SOIL"},{"f":11,"science":"NONE","x":23,"y":8,"terrain":"SOIL"},{"f":11,"science":"NONE","x":24,"y":8,"terrain":"SOIL"},{"f":11,"science":"NONE","x":25,"y":2,"terrain":"ROCK"},{"f":11,"science":"NONE","x":25,"y":3,"terrain":"ROCK"},{"f":11,"science":"NONE","x":25,"y":4,"terrain":"SOIL"},{"f":11,"science":"NONE","x":25,"y":5,"terrain":"SOIL"},{"f":11,"science":"NONE","x":25,"y":6,"terrain":"SOIL"},{"f":11,"science":"NONE","x":25,"y":7,"terrain":"SOIL"},{"f":11,"science":"NONE","x":25,"y":8,"terrain":"SOIL"},{"f":11,"science":"NONE","x":26,"y":2,"terrain":"SAND"},{"f":11,"science":"NONE","x":26,"y":3,"terrain":"ROCK"},{"f":11,"science":"NONE","x":26,"y":4,"terrain":"SOIL"},{"f":11,"science":"NONE","x":26,"y":5,"terrain":"SOIL"},{"f":11,"science":"NONE","x":26,"y":6,"terrain":"SOIL"},{"f":11,"science":"NONE","x":26,"y":7,"terrain":"SOIL"},{"f":11,"science":"NONE","x":26,"y":8,"terrain":"SOIL"},{"f":11,"science":"NONE","x":27,"y":2,"terrain":"SAND"},{"f":11,"science":"NONE","x":27,"y":3,"terrain":"ROCK"},{"f":11,"science":"NONE","x":27,"y":4,"terrain":"SOIL"},{"f":11,"science":"NONE","x":27,"y":5,"terrain":"SOIL"},{"f":11,"science":"NONE","x":27,"y":6,"terrain":"SOIL"},{"f":11,"science":"NONE","x":27,"y":7,"terrain":"SOIL"},{"f":11,"science":"NONE","x":27,"y":8,"terrain":"SAND"},{"f":11,"science":"NONE","x":28,"y":2,"terrain":"SAND"},{"f":11,"science":"NONE","x":28,"y":3,"terrain":"ROCK"},{"f":11,"science":"NONE","x":28,"y":4,"terrain":"SOIL"},{"f":11,"science":"NONE","x":28,"y":5,"terrain":"SOIL"},{"f":11,"science":"NONE","x":28,"y":6,"terrain":"SOIL"},{"f":11,"science":"NONE","x":28,"y":7,"terrain":"SAND"},{"f":11,"science":"NONE","x":28,"y":8,"terrain":"SAND"},{"f":11,"science":"NONE","x":29,"y":2,"terrain":"SAND"},{"f":11,"science":"NONE","x":29,"y":3,"terrain":"ROCK"},{"f":11,"science":"NONE","x":29,"y":4,"terrain":"SOIL"},{"f":11,"science":"NONE","x":29,"y":5,"terrain":"SOIL"},{"f":11,"science":"NONE","x":29,"y":6,"terrain":"SOIL"},{"f":11,"science":"NONE","x":29,"y":7,"terrain":"SAND"},{"f":11,"science":"NONE","x":29,"y":8,"terrain":"ROCK"},{"f":11,"science":"NONE","x":30,"y":2,"terrain":"SAND"},{"f":11,"science":"NONE","x":30,"y":3,"terrain":"ROCK"},{"f":11,"science":"NONE","x":30,"y":4,"terrain":"SOIL"},{"f":11,"science":"NONE","x":30,"y":5,"terrain":"SOIL"},{"f":11,"science":"NONE","x":30,"y":6,"terrain":"SOIL"},{"f":11,"science":"NONE","x":30,"y":7,"terrain":"SAND"},{"f":11,"science":"NONE","x":30,"y":8,"terrain":"ROCK"},{"f":11,"science":"NONE","x":24,"y":9,"terrain":"SOIL"},{"f":11,"science":"NONE","x":25,"y":9,"terrain":"SAND"},{"f":11,"science":"NONE","x":26,"y":9,"terrain":"SAND"},{"f":11,"science":"NONE","x":27,"y":9,"terrain":"SAND"},{"f":11,"science":"NONE","x":28,"y":9,"terrain":"ROCK"},{"f":11,"science":"NONE","x":29,"y":9,"terrain":"ROCK"},{"f":11,"science":"NONE","x":30,"y":9,"terrain":"SOIL"},{"f":11,"science":"NONE","x":31,"y":3,"terrain":"ROCK"},{"f":11,"science":"NONE","x":31,"y":4,"terrain":"SOIL"},{"f":11,"science":"NONE","x":31,"y":5,"terrain":"SOIL"},{"f":11,"science":"NONE","x":31,"y":6,"terrain":"SOIL"},{"f":11,"science":"NONE","x":31,"y":7,"terrain":"SOIL"},{"f":11,"science":"NONE","x":31,"y":8,"terrain":"ROCK"},{"f":11,"science":"NONE","x":31,"y":9,"terrain":"SOIL"},{"f":11,"science":"NONE","x":32,"y":3,"terrain":"ROCK"},{"f":11,"science":"NONE","x":32,"y":4,"terrain":"SOIL"},{"f":11,"science":"NONE","x":32,"y":5,"terrain":"SOIL"},{"f":11,"science":"NONE","x":32,"y":6,"terrain":"SOIL"},{"f":11,"science":"NONE","x":32,"y":7,"terrain":"SOIL"},{"f":11,"science":"NONE","x":32,"y":8,"terrain":"ROCK"},{"f":11,"science":"NONE","x":32,"y":9,"terrain":"SOIL"},{"f":11,"science":"NONE","x":33,"y":3,"terrain":"ROCK"},{"f":11,"science":"NONE","x":33,"y":4,"terrain":"SOIL"},{"f":11,"science":"NONE","x":33,"y":5,"terrain":"SOIL"},{"f":11,"science":"NONE","x":33,"y":6,"terrain":"SOIL"},{"f":11,"science":"NONE","x":33,"y":7,"terrain":"SOIL"},{"f":11,"science":"NONE","x":33,"y":8,"terrain":"ROCK"},{"f":11,"science":"NONE","x":33,"y":9,"terrain":"SOIL"},{"f":11,"science":"NONE","x":34,"y":3,"terrain":"ROCK"},{"f":11,"science":"NONE","x":34,"y":4,"terrain":"SOIL"},{"f":11,"science":"NONE","x":34,"y":5,"terrain":"SOIL"},{"f":11,"science":"NONE","x":34,"y":6,"terrain":"SOIL"},{"f":11,"science":"NONE","x":34,"y":7,"terrain":"SOIL"},{"f":11,"science":"NONE","x":34,"y":8,"terrain":"ROCK"},{"f":11,"science":"NONE","x":34,"y":9,"terrain":"SOIL"},{"f":11,"science":"NONE","x":28,"y":10,"terrain":"ROCK"},{"f":11,"science":"NONE","x":29,"y":10,"terrain":"SOIL"},{"f":11,"science":"NONE","x":30,"y":10,"terrain":"SOIL"},{"f":11,"science":"NONE","x":31,"y":10,"terrain":"SOIL"},{"f":11,"science":"NONE","x":32,"y":10,"terrain":"SOIL"},{"f":11,"science":"NONE","x":33,"y":10,"terrain":"SOIL"},{"f":11,"science":"NONE","x":34,"y":10,"terrain":"SOIL"},{"f":11,"science":"NONE","x":28,"y":11,"terrain":"SOIL"},{"f":11,"science":"NONE","x":29,"y":11,"terrain":"SOIL"},{"f":11,"science":"NONE","x":30,"y":11,"terrain":"SOIL"},{"f":11,"science":"NONE","x":31,"y":11,"terrain":"SOIL"},{"f":11,"science":"NONE","x":32,"y":11,"terrain":"SOIL"},{"f":11,"science":"NONE","x":33,"y":11,"terrain":"SOIL"},{"f":11,"science":"NONE","x":34,"y":11,"terrain":"SOIL"},{"f":11,"science":"NONE","x":28,"y":12,"terrain":"SOIL"},{"f":11,"science":"NONE","x":29,"y":12,"terrain":"SOIL"},{"f":11,"science":"NONE","x":30,"y":12,"terrain":"SOIL"},{"f":11,"science":"NONE","x":31,"y":12,"terrain":"SOIL"},{"f":11,"science":"NONE","x":32,"y":12,"terrain":"SOIL"},{"f":11,"science":"NONE","x":33,"y":12,"terrain":"SOIL"},{"f":11,"science":"NONE","x":34,"y":12,"terrain":"SOIL"},{"f":11,"science":"NONE","x":28,"y":13,"terrain":"SOIL"},{"f":11,"science":"NONE","x":29,"y":13,"terrain":"SOIL"},{"f":11,"science":"NONE","x":30,"y":13,"terrain":"SOIL"},{"f":11,"science":"NONE","x":31,"y":13,"terrain":"SOIL"},{"f":11,"science":"NONE","x":32,"y":13,"terrain":"SOIL"},{"f":11,"science":"NONE","x":33,"y":13,"terrain":"SOIL"},{"f":11,"science":"NONE","x":34,"y":13,"terrain":"SOIL"},{"f":11,"science":"NONE","x":35,"y":7,"terrain":"SOIL"},{"f":11,"science":"NONE","x":35,"y":8,"terrain":"SOIL"},{"f":11,"science":"NONE","x":35,"y":9,"terrain":"SOIL"},{"f":11,"science":"NONE","x":35,"y":10,"terrain":"SOIL"},{"f":11,"science":"NONE","x":35,"y":11,"terrain":"SOIL"},{"f":11,"science":"NONE","x":35,"y":12,"terrain":"SOIL"},{"f":11,"science":"NONE","x":35,"y":13,"terrain":"SOIL"},{"f":11,"science":"NONE","x":29,"y":14,"terrain":"SOIL"},{"f":11,"science":"NONE","x":30,"y":14,"terrain":"SOIL"},{"f":11,"science":"NONE","x":31,"y":14,"terrain":"SOIL"},{"f":11,"science":"NONE","x":32,"y":14,"terrain":"SOIL"},{"f":11,"science":"NONE","x":33,"y":14,"terrain":"SOIL"},{"f":11,"science":"NONE","x":34,"y":14,"terrain":"SOIL"},{"f":11,"science":"NONE","x":35,"y":14,"terrain":"SOIL"},{"f":11,"science":"NONE","x":36,"y":8,"terrain":"SOIL"},{"f":11,"science":"NONE","x":36,"y":9,"terrain":"SOIL"},{"f":11,"science":"NONE","x":36,"y":10,"terrain":"SOIL"},{"f":11,"science":"NONE","x":36,"y":11,"terrain":"SOIL"},{"f":11,"science":"NONE","x":36,"y":12,"terrain":"SOIL"},{"f":11,"science":"NONE","x":36,"y":13,"terrain":"SOIL"},{"f":11,"science":"NONE","x":36,"y":14,"terrain":"SOIL"},{"f":11,"science":"NONE","x":30,"y":15,"terrain":"SOIL"},{"f":11,"science":"NONE","x":31,"y":15,"terrain":"SOIL"},{"f":11,"science":"NONE","x":32,"y":15,"terrain":"SOIL"},{"f":11,"science":"NONE","x":33,"y":15,"terrain":"SOIL"},{"f":11,"science":"NONE","x":34,"y":15,"terrain":"SOIL"},{"f":11,"science":"NONE","x":35,"y":15,"terrain":"SOIL"},{"f":11,"science":"NONE","x":36,"y":15,"terrain":"SOIL"},{"f":11,"science":"NONE","x":37,"y":9,"terrain":"SOIL"},{"f":11,"science":"NONE","x":37,"y":10,"terrain":"SOIL"},{"f":11,"science":"NONE","x":37,"y":11,"terrain":"SAND"},{"f":11,"science":"NONE","x":37,"y":12,"terrain":"SOIL"},{"f":11,"science":"NONE","x":37,"y":13,"terrain":"SOIL"},{"f":11,"science":"NONE","x":37,"y":14,"terrain":"SOIL"},{"f":11,"science":"NONE","x":37,"y":15,"terrain":"SOIL"},{"f":11,"science":"NONE","x":31,"y":16,"terrain":"SOIL"},{"f":11,"science":"NONE","x":32,"y":16,"terrain":"SOIL"},{"f":11,"science":"NONE","x":33,"y":16,"terrain":"SOIL"},{"f":11,"science":"NONE","x":34,"y":16,"terrain":"SOIL"},{"f":11,"science":"NONE","x":35,"y":16,"terrain":"SOIL"},{"f":11,"science":"NONE","x":36,"y":16,"terrain":"SOIL"},{"f":11,"science":"NONE","x":37,"y":16,"terrain":"SOIL"},{"f":11,"science":"NONE","x":38,"y":10,"terrain":"SAND"},{"f":11,"science":"NONE","x":38,"y":11,"terrain":"ROCK"},{"f":11,"science":"NONE","x":38,"y":12,"terrain":"ROCK"},{"f":11,"science":"NONE","x":38,"y":13,"terrain":"SOIL"},{"f":11,"science":"NONE","x":38,"y":14,"terrain":"SOIL"},{"f":11,"science":"NONE","x":38,"y":15,"terrain":"SOIL"},{"f":11,"science":"NONE","x":38,"y":16,"terrain":"SOIL"},{"f":11,"science":"NONE","x":32,"y":17,"terrain":"SOIL"},{"f":11,"science":"NONE","x":33,"y":17,"terrain":"SOIL"},{"f":11,"science":"NONE","x":34,"y":17,"terrain":"SOIL"},{"f":11,"science":"NONE","x":35,"y":17,"terrain":"SOIL"},{"f":11,"science":"NONE","x":36,"y":17,"terrain":"SOIL"},{"f":11,"science":"NONE","x":37,"y":17,"terrain":"SOIL"},{"f":11,"science":"NONE","x":38,"y":17,"terrain":"SOIL"},{"f":11,"science":"NONE","x":39,"y":11,"terrain":"ROCK"},{"f":11,"science":"NONE","x":39,"y":12,"terrain":"SOIL"},{"f":11,"science":"NONE","x":39,"y":13,"terrain":"SOIL"},{"f":11,"science":"NONE","x":39,"y":14,"terrain":"SOIL"},{"f":11,"science":"NONE","x":39,"y":15,"terrain":"SOIL"},{"f":11,"science":"NONE","x":39,"y":16,"terrain":"SOIL"},{"f":11,"science":"NONE","x":39,"y":17,"terrain":"SOIL"},{"f":11,"science":"NONE","x":33,"y":18,"terrain":"SOIL"},{"f":11,"science":"NONE","x":34,"y":18,"terrain":"SOIL"},{"f":11,"science":"NONE","x":35,"y":18,"terrain":"SOIL"},{"f":11,"science":"NONE","x":36,"y":18,"terrain":"SOIL"},{"f":11,"science":"NONE","x":37,"y":18,"terrain":"SOIL"},{"f":11,"science":"NONE","x":38,"y":18,"terrain":"ROCK"},{"f":11,"science":"NONE","x":39,"y":18,"terrain":"ROCK"}];

// Homepage with instructions
app.get('/', function (req, res) {
    res.sendFile('index.html');
});

// get Global Map
app.get('/api/global', function (req, res) {
    // var secret = req.header('Corp-Secret');
    // if (!secret || secret !== process.env.GREENCORP_537_APIKEY) {
    //     res.status(401).send('Unauthorized. You must have GreenCorp secret to access global map');
    // } else {
        res.send(utils.mapToGlobal(map));
    // }
});

// post to global map
app.post('/api/global', function (req, res) {

    var rovername = req.header('Rover-Name');
    // var secret = req.header('Corp-Secret');
    var rover = rovers[rovername];
    console.log("Posting Global Map: rover " + rover.id);

    // if (!secret || (secret !== process.env.GREENCORP_537_APIKEY)) {
    //     res.status(401).send('Unauthorized. You must have GreenCorp secret to post');
    // } else {

        var tiles = req.body;
        // validate that the data is an array
        if (tiles && tiles.constructor === Array) {
            utils.updateGlobalMap(map, tiles, rover);
            res.send('OK');
        } else {
            res.send('Data must be an array');
        }
    // }
    // for each tile, save to an object mapping by a key string, to minimize access time
});

// resets the data
app.get('/api/global/reset', function (req, res) {
    // var secret = req.header('Corp-Secret');
    // if (!secret || secret !== process.env.GREENCORP_537_APIKEY) {
    //     res.status(401).send('Unauthorized. Ask Sam for reset');
    // } else {
        console.log("Getting Global Map: rover " + rover.id);
        map = {};
        res.send("Data cleaned. Now you can do it but later you will require apikey");
    // }
});

// for debugging
app.get('/api/debug/mapping', function (req, res) {
    res.send(map)
});

// for getting the size of the json array
app.get('/api/global/size', function (req, res) {
    var global = utils.mapToGlobal(map);
    var size = global.length;
    res.send(size.toString());
});

// for tutorial
app.get('/api/global/test', function (req, res) {
    var testmap = [
        {x: 1, y: 2, terrain: enums.terrain.GRAVEL, science: enums.science.CRYSTAL},
        {x: 3, y: 4, terrain: enums.terrain.SAND, science: enums.science.ORGANIC},
        {x: 5, y: 6, terrain: enums.terrain.SOIL, science: enums.science.MINERAL},
        {x: 7, y: 8, terrain: enums.terrain.ROCK, science: enums.science.RADIOACTIVE},
        {x: 9, y: 10, terrain: enums.terrain.NONE, science: enums.science.NONE}
    ]
    res.send(testmap);
});

// option choices:
// /science/all, /science/drill, /science/excavate
app.get('/api/science/:option', function (req, res) {
    var param = req.params.option;
    if (param === 'all' || param === 'drill' || param === 'excavate')
        res.send(utils.mapToGlobal(map, param));
    else res.send('api/science/:parameter must be either \'all\', \'drill\', or \'excavate\' ');
});

app.get('/api/coord/:x/:y', function (req, res) {
    var key = utils.getKey(req.params.x, req.params.y);
    var result = (map[key] === undefined) ? '' : map[key];
    res.send(result);
});

// for changing the specific tile
app.post('/api/coord/:x/:y/:science', function (req, res) {

    var rovername = req.header('Rover-Name');
    // var secret = req.header('Corp-Secret');
    var rover = rovers[rovername];
    var science = req.params.science;

    // if (!secret || (secret !== process.env.GREENCORP_537_APIKEY)) {
    //     res.status(401).send('Unauthorized. You must have GreenCorp secret to post');
    // } else {
        var key = utils.getKey(req.params.x, req.params.y);
        if (!key)
            res.status(400).send('Bad input of X and Y');
        else {
            if (utils.validateScience(science)) {
                res.status(400).send('Bad input of science');
            } else {
                if (map[key]) {
                    map[key].science = science;
                    
                    // specify which rover found this
                    map[key].f = rover.id;
                    res.send('Changed tile ' + key);
                } else {
                    res.status(400).send('Coordinate doesn\'t exist in global map');
                }

            }
        }
    // }
})

app.post('/api/science/gather/:x/:y', function (req, res) {

    var rovername = req.header('Rover-Name');
    // var secret = req.header('Corp-Secret');
    var rover = rovers[rovername];

    // if (!secret || (secret !== process.env.GREENCORP_537_APIKEY)) {
    //     res.status(401).send('Unauthorized. You must have GreenCorp secret to post');
    // } else {
        var key = utils.getKey(req.params.x, req.params.y);
        if (!key)
            res.status(400).send('Bad input of X and Y');
        else {
            if (map[key]) {
                if (map[key].science === 'NONE') {
                    res.status(400).send('No science in coordinate ' + key);

                    // TODO: implement tool and drive validity
                } else {
                    if (rover.tool !== enums.tools.NONE) {
                        map[key].g = rover.id;
                        res.send('Getting : ' + key);
                    }else{
                        res.send('Rover doesn\'t have tool for it');
                    }
                }
            } else {
                res.status(400).send('Coordinate doesn\'t exist in global map');
            }
        }
    // }

})

app.get('/api/roverinfo', function (req, res) {
    res.send(rovers);
});

app.get('/*', function (req, res) {
    res.redirect('/');
});

app.listen(3000);

console.log("Express app running on port 3000");

module.exports = app;