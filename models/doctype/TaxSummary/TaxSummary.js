const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021
module.exports = {
  name: 'TaxSummary',
  doctype: 'DocType',
  isChild: 1,
  fields: [
    {
      fieldname: 'account',
      label: __('Tax Account'),
      fieldtype: 'Link',
      target: 'Account',
      required: 1
    },
    {
      fieldname: 'rate',
      label: __('Rate'),
      fieldtype: 'Float',
      required: 1
    },
    {
      fieldname: 'amount',
      label: __('Amount'),
      fieldtype: 'Currency',
      required: 1
    },
    {
      fieldname: 'baseAmount',
      label: __('Amount (Company Currency)'),
      fieldtype: 'Currency',
      formula: (row, doc) => row.amount * doc.exchangeRate,
      readOnly: 1
    }
  ]
};
