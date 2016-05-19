var enums = require('./enums');

module.exports = {
    ROVER_10: {
        id: 10,
        sensor: enums.science.CRYSTAL,
        tool: enums.tools.NONE,
        drive: enums.drive.WHEELS
    },
    ROVER_11: {
        id: 11,
        sensor: enums.science.NONE,
        tool: enums.tools.BOTH,
        drive: enums.drive.WALKER
    },
    ROVER_12: {
        id: 12,
        sensor: enums.science.CRYSTAL,
        tool: enums.tools.NONE,
        drive: enums.drive.WHEELS
    },
    ROVER_13: {
        id: 13,
        sensor: enums.science.ORGANIC,
        tool: enums.tools.EXCAVATE,
        drive: enums.drive.TREADS
    },
    ROVER_14: {
        id: 14,
        sensor: enums.science.ORGANIC,
        tool: enums.tools.NONE,
        drive: enums.drive.WHEELS
    },
    ROVER_15: {
        id: 15,
        sensor: enums.science.NONE,
        tool: enums.tools.BOTH,
        drive: enums.drive.TREADS
    },
    ROVER_16: {
        id: 16,
        sensor: enums.science.RADIOACTIVE,
        tool: enums.tools.DRILL,
        drive: enums.drive.WALKER
    },
    ROVER_17: {
        id: 17,
        sensor: enums.science.MINERAL,
        tool: enums.tools.NONE,
        drive: enums.drive.WHEELS
    },
    ROVER_18: {
        id: 18,
        sensor: enums.science.MINERAL,
        tool: enums.tools.EXCAVATE,
        drive: enums.drive.WHEELS
    },
    ROVER_00: {
        id: 00,
        sensor: enums.science.RADIOACTIVE,
        tool: enums.tools.NONE,
        drive: enums.drive.WHEELS
    },
    ROVER_98: {
        id: 98,
        sensor: enums.science.CRYSTAL,
        tool: enums.tools.DRILL,
        drive: enums.drive.WALKER
    },
    ROVER_99: {
        id: 99,
        sensor: enums.science.ORGANIC,
        tool: enums.tools.NONE,
        drive: enums.drive.TREADS
    }
}