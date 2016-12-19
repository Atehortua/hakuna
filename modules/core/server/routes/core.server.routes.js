'use strict';


module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');
  var assistant = require('../controllers/assistant.server.controller');

  app.route('/api/links/').get(assistant.findLinks);
  app.route('/api/links/').post(assistant.add);
  app.route('/api/links/:id').put(assistant.update);
  app.route('/api/links/:id').delete(assistant.destroy);

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);
};
