var Payments = {
  payments : [],
  paymentRef : {},
  totalPaid : 0,
  totalFee : 0,
  paymentDiv : $('#payments'),
  init : function(data) {
    var itemString = '';
    data.forEach((item) => {
      var description = item.description || 'N/A';
      this.payments.push(item);
      this.paymentRef[item.id] = item;
      this.totalPaid += item.amount;
      this.totalFee  += item.fee;
      itemString += `
      <div class="item">
        <div class="content">
          <div class="header">
            <a class="header pay-more" data-itemId=${item.id}>${item.amount}</a>
          </div>
          ${description} - ${item.transactionData.date}
        </div>
      </div>`
    });
    this.paymentDiv.append(itemString);
    this.bindEvents();
  },
  loadItemDetails : function(id, element){
    var item = this.paymentRef[id];
    var popup = $('div.popup');
    if (popup.length > 0) {
      $('div.popup').remove();
    }
    var appendable =  `<div class="ui fluid popup top left transition hidden">
    <div class="ui two column divided grid">
      <div class="column">
        ${item.paymentStatus}
      </div>
      <div class="column">
        ${item.source}
      </div>
    </div>`;
    $(element).parent().append(appendable);
    $('div.popup').removeClass('hidden').show();
    $('div.popup').on('click', function() {
      $('div.popup').hide();
    });

  },
  bindEvents : function(){
    $('a.pay-more', this.paymentDiv).on('click', function() {
      // $('div.popup').remove();
      Payments.loadItemDetails($(this).attr('data-itemId'), $(this));
    });
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
