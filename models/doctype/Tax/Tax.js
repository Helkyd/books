const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021
module.exports = {
  name: 'Tax',
  label: __('Tax'),
  doctype: 'DocType',
  isSingle: 0,
  isChild: 0,
  keywordFields: ['name'],
  fields: [
    {
      fieldname: 'name',
      label: __('Name'),
      fieldtype: 'Data',
      required: 1
    },
    {
      fieldname: 'details',
      label: __('Details'),
      fieldtype: 'Table',
      childtype: 'TaxDetail',
      required: 1
    }
  ],
  quickEditFields: ['details']
};
