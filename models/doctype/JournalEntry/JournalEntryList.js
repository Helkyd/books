import { _ } from 'frappejs/utils';

const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

export default {
  doctype: 'JournalEntry',
  title: __('Journal Entry'),
  formRoute: name => `/edit/JournalEntry/${name}`,
  columns: [
    'date',
    {
      label: __('Entry ID'),
      fieldname: 'name',
      fieldtype: 'Data',
      getValue(doc) {
        return doc.name;
      }
    },
    'entryType',
    'referenceNumber'
  ]
};
