const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

module.exports = {
  name: 'Address',
  doctype: 'DocType',
  isSingle: 0,
  keywordFields: [
    'addressLine1',
    'addressLine2',
    'city',
    'state',
    'country',
    'postalCode'
  ],
  fields: [
    {
      fieldname: 'addressLine1',
      label: __('Address Line 1'),
      placeholder: 'Address Line 1',
      fieldtype: 'Data',
      required: 1
    },
    {
      fieldname: 'addressLine2',
      label: __('Address Line 2'),
      placeholder: 'Address Line 2',
      fieldtype: 'Data'
    },
    {
      fieldname: 'city',
      label: __('City / Town'),
      placeholder: 'City / Town',
      fieldtype: 'Data',
      required: 1
    },
    {
      fieldname: 'state',
      label: __('State'),
      placeholder: 'State',
      fieldtype: 'Data'
    },
    {
      fieldname: 'country',
      label: __('Country'),
      placeholder: 'Country',
      fieldtype: 'Data',
      required: 1
    },
    {
      fieldname: 'postalCode',
      label: __('Postal Code'),
      placeholder: 'Postal Code',
      fieldtype: 'Data'
    },
    {
      fieldname: 'emailAddress',
      label: __('Email Address'),
      placeholder: 'Email Address',
      fieldtype: 'Data'
    },
    {
      fieldname: 'phone',
      label: __('Phone'),
      placeholder: 'Phone',
      fieldtype: 'Data'
    },
    {
      fieldname: 'fax',
      label: __('Fax'),
      fieldtype: 'Data'
    },
    {
      fieldname: 'addressDisplay',
      fieldtype: 'Text',
      label: __('Address Display'),
      readOnly: true,
      formula: doc => {
        return [
          doc.addressLine1,
          doc.addressLine2,
          doc.city,
          doc.state,
          doc.country,
          doc.postalCode
        ]
          .filter(Boolean)
          .join(', ');
      }
    }
  ],
  quickEditFields: [
    'addressLine1',
    'addressLine2',
    'city',
    'state',
    'country',
    'postalCode'
  ],
  inlineEditDisplayField: 'addressDisplay'
};
