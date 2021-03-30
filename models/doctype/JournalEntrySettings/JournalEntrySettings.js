const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

module.exports = {
  name: 'JournalEntrySettings',
  label: __('Journal Entry Setting'),
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
      default: 'JV ' + new Date().toISOString().slice(0, 4) //'JV'
    }
  ]
};
