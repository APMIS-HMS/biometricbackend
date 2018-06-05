const assert = require('assert');
const app = require('../../src/app');

describe('\'enrolPatient\' service', () => {
  it('registered the service', () => {
    const service = app.service('enrol-patient');

    assert.ok(service, 'Registered the service');
  });
});
