const countryList = Object.keys(require('~/fixtures/countryInfo.json')).sort();

const { _ } = require('frappejs/utils');
//const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

module.exports = {
  name: 'AccountingSettings',
  label: _('Accounting Settings'),
  naming: 'name', // {random|autoincrement}
  isSingle: 1,
  isChild: 0,
  isSubmittable: 0,
  settings: null,
  keywordFields: [],
  fields: [
    {
      label: _('Company Name'),
      fieldname: 'companyName',
      fieldtype: 'Data',
      required: 1
    },

    {
      label: _('Write Off Account'),
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
      label: _('Round Off Account'),
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
      label: _('Country'),
      fieldtype: 'AutoComplete',
      placeholder: 'Select Country',
      required: 1,
      getList: () => countryList
    },

    {
      fieldname: 'currency',
      label: _('Currency'),
      fieldtype: 'Data',
      required: 0
    },

    {
      fieldname: 'fullname',
      label: _('Name'),
      fieldtype: 'Data',
      required: 1
    },

    {
      fieldname: 'email',
      label: _('Email'),
      fieldtype: 'Data',
      required: 1,
      validate: {
        type: 'email'
      }
    },

    {
      fieldname: 'bankName',
      label: _('Bank Name'),
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
      label: _('Regime do IVA'),
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
      label: _('Lingua do Sistema'),
      fieldtype: 'Select',
      options: ['EN', 'PT-PT'],
      default: 'EN',
      required: 1
    },

    {
      fieldname: 'fiscalYearStart',
      label: _('Fiscal Year Start Date'),
      fieldtype: 'Date',
      required: 1
    },

    {
      fieldname: 'fiscalYearEnd',
      label: _('Fiscal Year End Date'),
      fieldtype: 'Date',
      required: 1
    },

    {
      fieldname: 'setupComplete',
      label: _('Setup Complete'),
      fieldtype: 'Check',
      default: 0
    },

    {
      fieldname: 'autoUpdate',
      label: _('Auto Update'),
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
