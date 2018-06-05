// Initializes the `biometricsVerification` service on path `/biometrics-verification`
const createService = require('./biometrics-verification.class.js');
const hooks = require('./biometrics-verification.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name:'biometrics-verification',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/biometrics-verification', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('biometrics-verification');

  service.hooks(hooks);
};
