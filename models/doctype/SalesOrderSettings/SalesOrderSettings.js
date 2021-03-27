const model = require('frappejs/model');
const QuotationSettings = require('../QuotationSettings/QuotationSettings');

module.exports = model.extend(QuotationSettings, {
  name: 'SalesOrderSettings',
  label: 'Sales Order Settings',
  fields: [
    {
      fieldname: 'numberSeries',
      default: 'OV ' + new Date().toISOString().slice(0, 4) //'SO'
    }
  ]
});
