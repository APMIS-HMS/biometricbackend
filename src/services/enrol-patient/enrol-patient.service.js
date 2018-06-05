// Initializes the `enrolPatient` service on path `/enrol-patient`
const createService = require('./enrol-patient.class.js');
const hooks = require('./enrol-patient.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name:'enrol-patient',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/enrol-patient', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('enrol-patient');

  service.hooks(hooks);
};
