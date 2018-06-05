// Initializes the `nacaApi` service on path `/naca-api`
const createService = require('feathers-mongoose');
const createModel = require('../../models/naca-api.model');
const hooks = require('./naca-api.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/naca-api', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('naca-api');

  service.hooks(hooks);
};
