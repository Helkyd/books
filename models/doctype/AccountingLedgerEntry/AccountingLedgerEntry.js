const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

module.exports = {
  name: 'AccountingLedgerEntry',
  label: __('Ledger Entry'),
  naming: 'autoincrement',
  doctype: 'DocType',
  isSingle: 0,
  isChild: 0,
  keywordFields: ['account', 'party', 'referenceName'],
  fields: [
    {
      fieldname: 'date',
      label: __('Date'),
      fieldtype: 'Date'
    },
    {
      fieldname: 'account',
      label: __('Account'),
      fieldtype: 'Link',
      target: 'Account',
      required: 1
    },
    {
      fieldname: 'description',
      label: __('Description'),
      fieldtype: 'Text'
    },
    {
      fieldname: 'party',
      label: __('Party'),
      fieldtype: 'Link',
      target: 'Party'
    },
    {
      fieldname: 'debit',
      label: __('Debit'),
      fieldtype: 'Currency'
    },
    {
      fieldname: 'credit',
      label: __('Credit'),
      fieldtype: 'Currency'
    },
    {
      fieldname: 'againstAccount',
      label: __('Against Account'),
      fieldtype: 'Text'
    },
    {
      fieldname: 'referenceType',
      label: __('Ref. Type'),
      fieldtype: 'Data'
    },
    {
      fieldname: 'referenceName',
      label: __('Ref. Name'),
      fieldtype: 'DynamicLink',
      references: 'referenceType'
    },
    {
      fieldname: 'balance',
      label: __('Balance'),
      fieldtype: 'Currency'
    }
  ],
  quickEditFields: [
    'date',
    'account',
    'description',
    'party',
    'debit',
    'credit',
    'againstAccount',
    'referenceType',
    'referenceName',
    'balance'
  ]
};
