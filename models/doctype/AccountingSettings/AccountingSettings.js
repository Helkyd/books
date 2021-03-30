const countryList = Object.keys(require('~/fixtures/countryInfo.json')).sort();

const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

module.exports = {
  name: 'AccountingSettings',
  label: __('Accounting Settings'),
  naming: 'name', // {random|autoincrement}
  isSingle: 1,
  isChild: 0,
  isSubmittable: 0,
  settings: null,
  keywordFields: [],
  fields: [
    {
      label: __('Company Name'),
      fieldname: 'companyName',
      fieldtype: 'Data',
      required: 1
    },

    {
      label: __('Write Off Account'),
      fieldname: 'writeOffAccount',
      fieldtype: 'Link',
      target: 'Account',
      default: 'Write Off',
      getFilters() {
        return {
          isGroup: 0,
          rootType: 'Expense'
        };
      }
    },

    {
      label: __('Round Off Account'),
      fieldname: 'roundOffAccount',
      fieldtype: 'Link',
      target: 'Account',
      default: 'Rounded Off',
      getFilters() {
        return {
          isGroup: 0,
          rootType: 'Expense'
        };
      }
    },

    {
      fieldname: 'country',
      label: __('Country'),
      fieldtype: 'AutoComplete',
      placeholder: 'Select Country',
      required: 1,
      getList: () => countryList
    },

    {
      fieldname: 'currency',
      label: __('Currency'),
      fieldtype: 'Data',
      required: 0
    },

    {
      fieldname: 'fullname',
      label: __('Name'),
      fieldtype: 'Data',
      required: 1
    },

    {
      fieldname: 'email',
      label: __('Email'),
      fieldtype: 'Data',
      required: 1,
      validate: {
        type: 'email'
      }
    },

    {
      fieldname: 'bankName',
      label: __('Bank Name'),
      fieldtype: 'Data',
      required: 1
    },

    {
      fieldname: 'nifEmpresa',
      label: 'NIF',
      fieldtype: 'Data',
      placeholder: 'NIF Empresa'
    },
    {
      fieldname: 'regimeIva',
      label: __('Regime do IVA'),
      fieldtype: 'Select',
      options: [
        'Regime Geral',
        'Regime Transitorio',
        'Regime Simplificado',
        'Regime de Caixa',
        'Regime de nao Sujeicao',
        'Regime de Exclusao'
      ],
      default: 'Regime de Exclusao',
      required: 1
    },
    {
      fieldname: 'linguasistema',
      label: __('Lingua do Sistema'),
      fieldtype: 'Select',
      options: ['EN', 'PT-PT'],
      default: 'EN',
      required: 1
    },

    {
      fieldname: 'fiscalYearStart',
      label: __('Fiscal Year Start Date'),
      fieldtype: 'Date',
      required: 1
    },

    {
      fieldname: 'fiscalYearEnd',
      label: __('Fiscal Year End Date'),
      fieldtype: 'Date',
      required: 1
    },

    {
      fieldname: 'setupComplete',
      label: __('Setup Complete'),
      fieldtype: 'Check',
      default: 0
    },

    {
      fieldname: 'autoUpdate',
      label: __('Auto Update'),
      fieldtype: 'Check',
      default: 1
    }
  ],
  quickEditFields: [
    'fullname',
    'email',
    'nifEmpresa',
    'regimeIva',
    'linguasistema',
    'companyName',
    'country',
    'currency',
    'fiscalYearStart',
    'fiscalYearEnd'
  ]
};
