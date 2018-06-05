const assert = require('assert');
const app = require('../../src/app');

describe('\'biometricsVerification\' service', () => {
  it('registered the service', () => {
    const service = app.service('biometrics-verification');

    assert.ok(service, 'Registered the service');
  });
});
