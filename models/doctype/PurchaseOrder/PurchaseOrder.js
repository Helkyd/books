const model = require('frappejs/model');
const PurchaseInvoice = require('../PurchaseInvoice/PurchaseInvoice');

const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

module.exports = model.extend(
  PurchaseInvoice,
  {
    name: 'PurchaseOrder',
    label: __('Purchase Order'),
    settings: 'PurchaseOrderSettings',
    fields: [
      {
        fieldname: 'items',
        childtype: 'PurchaseOrderItem'
      }
    ]
  },
  {
    skipFields: ['account']
  }
);
