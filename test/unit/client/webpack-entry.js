global.expect = require('chai').expect;

require('../../requirements/mocha');

require('./../api/api.unit.js');
require('./jquery-example.unit');
require('./members-observer.unit');
require('./post-hunter/sorting.unit');
require('./post-hunter/ok-ru-parser.unit');