// Initializes the `saveAllFingers` service on path `/save-all-fingers`
const createService = require('feathers-mongoose');
const createModel = require('../../models/save-all-fingers.model');
const hooks = require('./save-all-fingers.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/save-all-fingers', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('save-all-fingers');

  service.hooks(hooks);
};
