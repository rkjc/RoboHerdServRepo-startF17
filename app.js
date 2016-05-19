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


var map = {};

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
    var secret = req.header('Corp-Secret');
    var rover = rovers[rovername];
    // console.log("rover " + rover.id + ", secret: " + secret);

    if (!secret || (secret !== process.env.GREENCORP_537_APIKEY)) {
        res.status(401).send('Unauthorized. You must have GreenCorp secret to post');
    } else {

        var tiles = req.body;
        // validate that the data is an array
        if (tiles && tiles.constructor === Array) {
            utils.updateGlobalMap(map, tiles, rover);
            res.send('OK');
        } else {
            res.send('Data must be an array');
        }
    }
    // for each tile, save to an object mapping by a key string, to minimize access time
});

// resets the data
app.get('/api/global/reset', function (req, res) {
    // var secret = req.header('Corp-Secret');
    // if (!secret || secret !== process.env.GREENCORP_537_APIKEY) {
    //     res.status(401).send('Unauthorized. You must have GreenCorp secret to access global map');
    // } else {
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
    var secret = req.header('Corp-Secret');
    var rover = rovers[rovername];
    var science = req.params.science;

    if (!secret || (secret !== process.env.GREENCORP_537_APIKEY)) {
        res.status(401).send('Unauthorized. You must have GreenCorp secret to post');
    } else {
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
    }
})

app.post('/api/science/gather/:x/:y', function (req, res) {

    var rovername = req.header('Rover-Name');
    var secret = req.header('Corp-Secret');
    var rover = rovers[rovername];

    if (!secret || (secret !== process.env.GREENCORP_537_APIKEY)) {
        res.status(401).send('Unauthorized. You must have GreenCorp secret to post');
    } else {
        var key = utils.getKey(req.params.x, req.params.y);
        if (!key)
            res.status(400).send('Bad input of X and Y');
        else {
            if (map[key]) {
                if (map[key].science === 'NONE') {
                    res.status(400).send('No science in coordinate ' + key);

                    // TODO: implement tool and drive validity
                } else {
                    if (rover.tool) {
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
    }

})

app.get('/api/roverinfo', function (req, res) {
    res.send(rovers);
});

app.listen(3000);

console.log("Express app running on port 3000");

module.exports = app;