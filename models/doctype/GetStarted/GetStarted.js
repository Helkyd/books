const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

module.exports = {
  name: 'GetStarted',
  isSingle: 1,
  fields: [
    {
      fieldname: 'onboardingComplete',
      label: __('Onboarding Complete'),
      fieldtype: 'Check'
    },
    {
      fieldname: 'companySetup',
      label: __('Company Setup'),
      fieldtype: 'Check'
    },
    {
      fieldname: 'systemSetup',
      label: __('System Setup'),
      fieldtype: 'Check'
    },
    {
      fieldname: 'invoiceSetup',
      label: __('Invoice Setup'),
      fieldtype: 'Check'
    },
    {
      fieldname: 'itemCreated',
      label: __('Item Created'),
      fieldtype: 'Check'
    },
    {
      fieldname: 'customerCreated',
      label: __('Customer Created'),
      fieldtype: 'Check'
    },
    {
      fieldname: 'supplierCreated',
      label: __('Supplier Created'),
      fieldtype: 'Check'
    },
    {
      fieldname: 'invoiceCreated',
      label: __('Invoice Created'),
      fieldtype: 'Check'
    },
    {
      fieldname: 'billCreated',
      label: __('Bill Created'),
      fieldtype: 'Check'
    },
    {
      fieldname: 'chartOfAccountsReviewed',
      label: __('Chart Of Accounts Reviewed'),
      fieldtype: 'Check'
    }
  ]
};
