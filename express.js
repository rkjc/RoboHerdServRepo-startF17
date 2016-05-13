/**
 * Created by samskim on 5/11/16.
 */
var express = require('express'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser');

module.exports = function () {
    var app = express();

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'game') {
        app.use(compress());
    }

    app.use(bodyParser.json());
    app.use(methodOverride());

    app.use(express.static('./public'));
    
    return app;
}