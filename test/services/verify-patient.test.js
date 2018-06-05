const assert = require('assert');
const app = require('../../src/app');

describe('\'verifyPatient\' service', () => {
  it('registered the service', () => {
    const service = app.service('verify-patient');

    assert.ok(service, 'Registered the service');
  });
});
