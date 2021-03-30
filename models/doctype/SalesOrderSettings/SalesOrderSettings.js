const model = require('frappejs/model');
const QuotationSettings = require('../QuotationSettings/QuotationSettings');

const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

module.exports = model.extend(QuotationSettings, {
  name: 'SalesOrderSettings',
  label: __('Sales Order Settings'),
  fields: [
    {
      fieldname: 'numberSeries',
      default: 'OV ' + new Date().toISOString().slice(0, 4) //'SO'
    }
  ]
});
