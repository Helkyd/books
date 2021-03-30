const model = require('frappejs/model');
const PurchaseOrderItem = require('../PurchaseOrderItem/PurchaseOrderItem');

const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

module.exports = model.extend(
  PurchaseOrderItem,
  {
    name: 'PurchaseReceiptItem',
    fields: [
      {
        fieldname: 'acceptedQuantity',
        label: __('Accepted Quantity'),
        fieldtype: 'Float',
        required: 1
      }
    ]
  },
  {
    skipFields: ['expenseAccount']
  }
);
