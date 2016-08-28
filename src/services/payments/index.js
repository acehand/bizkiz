'use strict';

const hooks = require('./hooks');
const simplify = require('simplify-commerce');
var localData = [];
const client = simplify.getClient({
  publicKey: 'sbpb_NzIzNGUwMTAtM2M1Yy00ODg3LWFlM2ItYTBiMWU3YWQ4Zjk0',
  privateKey: '7w4udToSnGLbG6PVHYvJy64Qb/w0eT0TUTOjqe385Zl5YFFQL0ODSXAOkNtXTToq'
});

class Service {
  constructor(options) {
    this.options = options || {};
  }
  find(params) {
    var data = [],
    that = this;
    var list = this.options.client.list({max : 30}, (error, data) => {
      that.data = data;
    });
    var promise = new Promise((resolve, reject) => {
     setTimeout(() => {
       resolve(that.data);
     },2000);
    });
    return promise;
  }
  get(id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }
  create(data, params) {
    if(Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }
    return Promise.resolve(data);
  }
  update(id, data, params) {
    return Promise.resolve(data);
  }
  patch(id, data, params) {
    return Promise.resolve(data);
  }
  remove(id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function(){
  const app = this;
  var that=this;
  // client.payment.list({max: 30}, function(errData, data){
  //   if(errData){
  //       console.error("Error Message: " + errData.data.error.message);
  //       return;
  //   }
  //   console.log("Total: " + data.total);
  //   that.localData = data;
  //   for(var i=0; i < data.list.length; i++){
  //     console.log("Amount: " + data.list[i].amount);
  //   }
  // });
  // Initialize our service with any options it requires
  app.use('/payments', new Service({
    timeout : 10000,
    client : client.payment
  }));

  // Get our initialize service to that we can bind hooks
  const paymentsService = app.service('/payments');

  // Set up our before hooks
  paymentsService.before(hooks.before);

  // Set up our after hooks
  paymentsService.after(hooks.after);
};

module.exports.Service = Service;
