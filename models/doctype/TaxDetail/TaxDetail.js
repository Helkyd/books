module.exports = {
  name: 'TaxDetail',
  label: 'Tax Detail',
  doctype: 'DocType',
  isSingle: 0,
  isChild: 1,
  keywordFields: [],
  fields: [
    {
      fieldname: 'account',
      label: 'Tax Account',
      fieldtype: 'Link',
      target: 'Account',
      required: 1
    },
    {
      fieldname: 'rate',
      label: 'Rate',
      fieldtype: 'Float',
      required: 1,
      placeholder: '0%'
    },
    {
      fieldname: 'motivo', //HELKYds 05-12-2020
      label: 'Motive',
      fieldtype: 'Data',
      required: 0
    }
  ],
  tableFields: ['account', 'rate', 'motivo']
};
