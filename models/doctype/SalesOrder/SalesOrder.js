const model = require('frappejs/model');
const Quotation = require('../Quotation/Quotation');

const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

module.exports = model.extend(Quotation, {
  name: 'SalesOrder',
  label: __('Sales Order'),
  settings: 'SalesOrderSettings',
  fields: [
    {
      fieldname: 'items',
      childtype: 'SalesOrderItem'
    }
  ]
});
