const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

module.exports = {
  name: 'CompanySettings',
  label: __('Company Settings'),
  naming: 'autoincrement',
  isSingle: true,
  isChild: false,
  keywordFields: ['companyName'],
  fields: [
    {
      fieldname: 'companyName',
      label: __('Company Name'),
      fieldtype: 'Data',
      disabled: false,
      required: true
    },
    {
      fieldname: 'companyAddress',
      label: __('Company Address'),
      fieldtype: 'Link',
      disabled: false,
      required: true,
      target: 'Address'
    }
  ]
};
