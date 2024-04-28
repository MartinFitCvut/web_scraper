const EventEmitter = require('events');

global.runningScrapers = {};
global.scrapersInFunction = {};
global.eventEmitter = new EventEmitter();
