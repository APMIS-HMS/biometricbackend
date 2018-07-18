const assert = require('assert');
const app = require('../../src/app');

describe('\'intercept-verificaton\' service', () => {
  it('registered the service', () => {
    const service = app.service('intercept-verificaton');

    assert.ok(service, 'Registered the service');
  });
});
