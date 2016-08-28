'use strict';

const service = require('feathers-sequelize');
const mastercard = require('./mastercard-model');
const hooks = require('./hooks');
const simplify = require('simplify-commerce');

module.exports = function(){
  const app = this;

  const options = {
    Model: mastercard(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/mastercards', service(options));

  // Get our initialize service to that we can bind hooks
  const mastercardService = app.service('/mastercards');

  // Set up our before hooks
  mastercardService.before(hooks.before);

  // Set up our after hooks
  mastercardService.after(hooks.after);
};
