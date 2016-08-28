var Payments = {
  payments : [],
  totalPaid : 0,
  totalFee : 0,
  paymentDiv : $('#payments'),
  init : function(data) {
    var itemString = '';
    data.forEach((item) => {
      var description = item.description || 'N/A';
      this.payments.push(item);
      this.totalPaid += item.amount;
      this.totalFee  += item.fee;
      itemString += `
      <div class="item">
        <div class="content">
        <div class="header">${item.amount}</div>
          ${description} - ${item.transactionData.date}
        </div>
      </div>`
    });
    this.paymentDiv.append(itemString);
  },
  addElements : function() {
  }
};
const socket = io();
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const app = feathers()
  .configure(feathers.socketio(socket))
  .configure(feathers.hooks())
  // Use localStorage to store our login token
  .configure(feathers.authentication({
    storage: window.localStorage
  })
);
const userService = app.service('users');
const paymentsService = app.service('payments');
app.authenticate().then(
  () => {
  paymentsService.find().then((data) => {
    Payments.init(data.list);
  });
  userService.find().then(
    page => {});
    // const users = page.data;
    // Add every user to the list
    // users.forEach(addUser);
  // });

  // We will also see when new users get created in real-time
  // userService.on('created', addUser);
});
