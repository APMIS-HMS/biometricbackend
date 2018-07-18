const assert = require('assert');
const app = require('../../src/app');

describe('\'saveAllFingers\' service', () => {
  it('registered the service', () => {
    const service = app.service('save-all-fingers');

    assert.ok(service, 'Registered the service');
  });
});
