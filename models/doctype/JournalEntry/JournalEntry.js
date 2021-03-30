const { ledgerLink } = require('../../../accounting/utils');
const { DateTime } = require('luxon');

const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

module.exports = {
  label: __('Journal Entry'),
  name: 'JournalEntry',
  doctype: 'DocType',
  isSubmittable: 1,
  settings: 'JournalEntrySettings',
  fields: [
    {
      fieldname: 'entryType',
      label: __('Entry Type'),
      fieldtype: 'Select',
      placeholder: 'Entry Type',
      options: [
        'Journal Entry',
        'Bank Entry',
        'Cash Entry',
        'Credit Card Entry',
        'Debit Note',
        'Credit Note',
        'Contra Entry',
        'Excise Entry',
        'Write Off Entry',
        'Opening Entry',
        'Depreciation Entry'
      ],
      required: 1
    },
    {
      fieldname: 'date',
      label: __('Date'),
      fieldtype: 'Date',
      default: DateTime.local().toISODate()
    },
    {
      fieldname: 'accounts',
      label: __('Account Entries'),
      fieldtype: 'Table',
      childtype: 'JournalEntryAccount',
      required: true
    },
    {
      fieldname: 'referenceNumber',
      label: __('Reference Number'),
      fieldtype: 'Data'
    },
    {
      fieldname: 'referenceDate',
      label: __('Reference Date'),
      fieldtype: 'Date'
    },
    {
      fieldname: 'userRemark',
      label: __('User Remark'),
      fieldtype: 'Text',
      placeholder: 'User Remark'
    }
  ],
  actions: [
    {
      label: __('Revert'),
      condition: doc => doc.submitted,
      action(doc) {
        doc.revert();
      }
    },
    ledgerLink
  ]
};
