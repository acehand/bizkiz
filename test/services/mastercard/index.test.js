'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('mastercard service', function() {
  it('registered the mastercards service', () => {
    assert.ok(app.service('mastercards'));
  });
});
