const model = require('frappejs/model');
const PurchaseOrder = require('../PurchaseOrder/PurchaseOrder');

const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

module.exports = model.extend(PurchaseOrder, {
  name: 'PurchaseReceipt',
  label: __('Purchase Receipt'),
  settings: 'PurchaseReceiptSettings',
  fields: [
    {
      fieldname: 'items',
      childtype: 'PurchaseReceiptItem'
    }
  ]
});
