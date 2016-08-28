var chartingData = {}
var chartingFeeData = {}

var Charts = {
  init: function(data) {
    if(chartingData[moment(data.transactionData.date).format('YYYY-MM-DD')]) {
      chartingData[moment(data.transactionData.date).format('YYYY-MM-DD')] += data.amount;
    } else {
      chartingData[moment(data.transactionData.date).format('YYYY-MM-DD')] = data.amount;
    }

    if(chartingFeeData[moment(data.transactionData.date).format('YYYY-MM-DD')]) {
      chartingFeeData[moment(data.transactionData.date).format('YYYY-MM-DD')] += data.fee;
    } else {
      chartingFeeData[moment(data.transactionData.date).format('YYYY-MM-DD')] = data.fee;
    }
  }
};

function fn(chartingDataJson) {
  console.info(chartingDataJson)
  var chart = AmCharts.makeChart("chartdiv", {
    "theme": "light",
    "type": "serial",
    "dataProvider": JSON.parse(chartingDataJson),
    "valueAxes": [{
        "stackType": "3d",
        "unit": "%",
        "position": "left",
        "title": "GDP growth rate",
    }],
    "startDuration": 1,
    "graphs": [{
        "balloonText": "Amount Received on [[category]] : <b>[[value]]</b>",
        "fillAlphas": 0.9,
        "lineAlpha": 0.2,
        "title": "2004",
        "type": "column",
        "valueField": "Received"
    }, {
        "balloonText": "Received Less Fees on [[category]] (2005): <b>[[value]]</b>",
        "fillAlphas": 0.9,
        "lineAlpha": 0.2,
        "title": "2005",
        "type": "column",
        "valueField": "LessFees"
    }],
    "plotAreaFillAlphas": 0.1,
    "depth3D": 60,
    "angle": 30,
    "categoryField": "date",
    "categoryAxis": {
        "gridPosition": "start"
    },
    "export": {
    	"enabled": true
     }
});
}

var Payments = {
  payments : [],
  paymentRef : {},
  totalPaid : 0,
  totalFee : 0,
  chartingDataJson : [],
  paymentDiv : $('#payments'),
  totalDiv : $('#total'),
  init : function(data, chartingDataJson) {
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
      Charts.init(item);
    });

    var counter = 0;
    for (var key in chartingData) {
      var tempData = '';
      var pvVal = '';

      if(counter == 0) {
        counter++;
      } else {
        pvVal = ',';
      }

      tempData += '{"date" : "' + key +'",';
      tempData += '"Received" : "' + (chartingData[key] - chartingFeeData[key]) +'",';
      tempData += '"LessFees" : ' + chartingData[key] +'}';

      chartingDataJson = tempData + pvVal + chartingDataJson;

    }
    chartingDataJson = '[' + chartingDataJson + ']';
    this.paymentDiv.append(itemString);
    var total =`
    <div class="ui statistics">
<div class="statistic">
  <div class="value">
    $${this.totalPaid}
  </div>
  <div class="label">
    Total Payments
  </div>
</div>
<div class="statistic">
  <div class="value">
    $${this.totalFee}
  </div>
  <div class="label">
    Fees Lost
  </div>
</div>
<div class="statistic">
  <div class="value">
    $${this.totalPaid - this.totalFee}
  </div>
  <div class="label">
    Total Received
  </div>
</div>
</div>
    `;
  this.totalDiv.append(total);
    this.bindEvents();
    return chartingDataJson;
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
    var chartingDataJson = '';
    chartingDataJson = Payments.init(data.list, chartingDataJson);
    fn(chartingDataJson);
  });
  userService.get(12).then(page => {

    $('a.profile span').text(page.email);
  });
});
