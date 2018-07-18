// Initializes the `intercept-verificaton` service on path `/intercept-verificaton`
const createService = require('./intercept-verificaton.class.js');
const hooks = require('./intercept-verificaton.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/intercept-verificaton', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('intercept-verificaton');

  service.hooks(hooks);
};
