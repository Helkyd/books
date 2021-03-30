const theme = require('@/theme');

const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

module.exports = {
  name: 'PrintSettings',
  label: __('Print Settings'),
  isSingle: 1,
  fields: [
    {
      fieldname: 'logo',
      label: __('Logo'),
      fieldtype: 'AttachImage'
    },
    {
      fieldname: 'companyName',
      label: __('Company Name'),
      fieldtype: 'Data'
    },
    {
      fieldname: 'nifEmpresa', //HELKYds 30-11-2020
      label: __('NIF Empresa'),
      fieldtype: 'Data'
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
      fieldname: 'linguasistema', //HELKYds 26-03-2021
      label: __('Lingua Sistema'),
      fieldtype: 'Select',
      options: ['EN', 'PT-PT'],
      default: 'EN',
      required: 1
    },

    {
      fieldname: 'email',
      label: __('Email'),
      fieldtype: 'Data',
      placeholder: 'john@doe.com',
      validate: {
        type: 'email'
      }
    },
    {
      fieldname: 'displayLogo',
      label: __('Display Logo in Invoice'),
      fieldtype: 'Check'
    },
    {
      fieldname: 'phone',
      label: __('Phone'),
      fieldtype: 'Data',
      placeholder: '9888900000',
      validate: {
        type: 'phone'
      }
    },
    {
      fieldname: 'address',
      label: __('Address'),
      fieldtype: 'Link',
      target: 'Address',
      placeholder: 'Click to create',
      inline: true
    },
    {
      fieldname: 'gstin',
      label: __('GSTIN'),
      fieldtype: 'Data',
      placeholder: '27AAAAA0000A1Z5'
    },
    {
      fieldname: 'template',
      label: __('Template'),
      fieldtype: 'Select',
      options: ['Basic', 'Minimal', 'Business'],
      default: 'Basic'
    },
    {
      fieldname: 'color',
      label: __('Color'),
      placeholder: 'Select Color',
      fieldtype: 'Color',
      colors: [
        'red',
        'orange',
        'yellow',
        'green',
        'teal',
        'blue',
        'indigo',
        'purple',
        'pink'
      ]
        .map(color => {
          let label = color[0].toUpperCase() + color.slice(1);
          return {
            label,
            value: theme.colors[color]['500']
          };
        })
        .concat({
          label: 'Black',
          value: theme.colors['black']
        })
    },
    {
      fieldname: 'font',
      label: __('Font'),
      fieldtype: 'AutoComplete',
      default: 'Inter'
    }
  ],
  quickEditFields: [
    'logo',
    'displayLogo',
    'template',
    'color',
    'email',
    'nifEmpresa',
    'regimeIva',
    'linguasistema',
    'phone',
    'address',
    'gstin'
  ]
};
