const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021
module.exports = {
  name: 'TaxDetail',
  label: __('Tax Detail'),
  doctype: 'DocType',
  isSingle: 0,
  isChild: 1,
  keywordFields: [],
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
      required: 1,
      placeholder: '0%'
    },
    {
      fieldname: 'motivo', //HELKYds 05-12-2020
      label: __('Motive'),
      fieldtype: 'Data',
      required: 0
    }
  ],
  tableFields: ['account', 'rate', 'motivo']
};
