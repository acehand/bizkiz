'use strict';

const assert = require('assert');
const profile = require('../../../../src/services/user/hooks/profile.js');

describe('user profile hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    profile()(mockHook);

    assert.ok(mockHook.profile);
  });
});
