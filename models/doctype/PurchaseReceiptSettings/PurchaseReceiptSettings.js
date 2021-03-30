const model = require('frappejs/model');
const PurchaseOrderSettings = require('../PurchaseOrderSettings/PurchaseOrderSettings');

const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

module.exports = model.extend(PurchaseOrderSettings, {
  name: 'PurchaseReceiptSettings',
  label: __('Purchase Receipt Settings'),
  fields: [
    {
      fieldname: 'numberSeries',
      default: 'REC ' + new Date().toISOString().slice(0, 4) //'PREC'
    }
  ]
});
