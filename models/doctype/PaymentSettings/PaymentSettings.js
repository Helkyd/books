const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

module.exports = {
  name: 'PaymentSettings',
  label: __('Payment Settings'),
  isSingle: 1,
  isChild: 0,
  keywordFields: [],
  fields: [
    {
      fieldname: 'numberSeries',
      label: __('Number Series'),
      fieldtype: 'Link',
      target: 'NumberSeries',
      required: 1,
      default: 'RC ' + new Date().toISOString().slice(0, 4) //'PAY'
    }
  ]
};
