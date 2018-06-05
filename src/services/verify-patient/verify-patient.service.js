// Initializes the `verifyPatient` service on path `/verify-patient`
const createService = require('./verify-patient.class.js');
const hooks = require('./verify-patient.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name:'verify-patient',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/verify-patient', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('verify-patient');

  service.hooks(hooks);
};
