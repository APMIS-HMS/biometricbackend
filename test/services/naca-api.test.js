const assert = require('assert');
const app = require('../../src/app');

describe('\'nacaApi\' service', () => {
  it('registered the service', () => {
    const service = app.service('naca-api');

    assert.ok(service, 'Registered the service');
  });
});
