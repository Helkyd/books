const model = require('frappejs/model');
const PurchaseInvoiceSettings = require('../PurchaseInvoiceSettings/PurchaseInvoiceSettings');

const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

module.exports = model.extend(PurchaseInvoiceSettings, {
  name: 'PurchaseOrderSettings',
  label: __('Purchase Order Settings'),
  fields: [
    {
      fieldname: 'numberSeries',
      default: 'OC ' + new Date().toISOString().slice(0, 4) //'PO'
    }
  ]
});
