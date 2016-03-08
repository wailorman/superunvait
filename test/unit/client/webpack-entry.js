global.expect = require('chai').expect;

require('../../requirements/mocha');

require('./../api/api.test.js');
require('./jquery-example.test.js');
require('./members-observer.test.js');
require('./post-hunter/sorting.test');