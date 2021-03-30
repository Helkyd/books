const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021
let proform = 'INT-PP ' + new Date().toISOString().slice(0, 4);

module.exports = {
  name: 'QuotationSettings',
  label: __('Quotation Settings'),
  doctype: 'DocType',
  isSingle: 1,
  isChild: 0,
  keywordFields: [],
  fields: [
    {
      fieldname: 'numberSeries',
      label: __('Number Series'),
      fieldtype: 'Link',
      target: 'NumberSeries',
      required: 1,
      default: proform
    },
    {
      fieldname: 'template',
      label: __('Template'),
      fieldtype: 'Select',
      options: ['Basic I', 'Basic II', 'Modern'],
      required: 1,
      default: 'Basic I'
    },
    {
      fieldname: 'font',
      label: __('Font'),
      fieldtype: 'Select',
      options: ['Montserrat', 'Open Sans', 'Oxygen', 'Merriweather'],
      required: 1,
      default: 'Montserrat'
    },
    {
      fieldname: 'themeColor',
      label: __('Theme Color'),
      fieldtype: 'Data',
      required: 1,
      default: '#000000',
      hidden: 1
    }
  ]
};
