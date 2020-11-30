const frappe = require('frappejs');
let { _ } = require('frappejs/utils');

module.exports = {
  name: 'Party',
  label: 'Party',
  keywordFields: ['name'],
  fields: [
    {
      fieldname: 'name',
      label: 'Name',
      fieldtype: 'Data',
      required: 1,
      placeholder: 'Full Name'
    },
    {
      fieldname: 'image',
      label: 'Image',
      fieldtype: 'AttachImage'
    },
    {
      fieldname: 'customer',
      label: 'Customer',
      fieldtype: 'Check'
    },
    {
      fieldname: 'supplier',
      label: 'Supplier',
      fieldtype: 'Check'
    },
    {
      fieldname: 'defaultAccount',
      label: 'Default Account',
      fieldtype: 'Link',
      target: 'Account',
      getFilters: (query, doc) => {
        return {
          isGroup: 0,
          accountType: doc.customer ? 'Receivable' : 'Payable'
        };
      },
      formula: doc => {
        if (doc.customer) {
          //HELKYDS 30-11-2020; if KZ
          if (frappe.AccountingSettings.currency === 'KZ') {
            return '31121000 - Clientes Nacionais';
          } else {
            return 'Debtors';
          }          
        }
        if (doc.supplier) {
          //HELKYDS 30-11-2020; if KZ
          if (frappe.AccountingSettings.currency === 'KZ') {
            return '32110000 - Fornecedores';
          } else {
            return 'Creditors';
          }
        }
      }
    },
    {
      fieldname: 'outstandingAmount',
      label: 'Outstanding Amount',
      fieldtype: 'Currency'
    },
    {
      fieldname: 'currency',
      label: 'Currency',
      fieldtype: 'Link',
      target: 'Currency',
      placeholder: 'INR',
      formula: () => frappe.AccountingSettings.currency
    },
    {
      fieldname: 'email',
      label: 'Email',
      fieldtype: 'Data',
      placeholder: 'john@doe.com',
      validate: {
        type: 'email'
      }
    },
    {
      fieldname: 'nif', //HELKYDS 30-11-2020
      label: 'NIF',
      fieldtype: 'Data',
      placeholder: 'NIF',
      required: () => {
        return frappe.AccountingSettings.currency === 'KZ' ? 1 : 0;
      }
    },

    {
      fieldname: 'phone',
      label: 'Phone',
      fieldtype: 'Data',
      placeholder: 'Phone',
      validate: {
        type: 'phone'
      }
    },
    {
      fieldname: 'address',
      label: 'Address',
      fieldtype: 'Link',
      target: 'Address',
      placeholder: _('Click to create'),
      inline: true
    },
    {
      fieldname: 'addressDisplay',
      label: 'Address Display',
      fieldtype: 'Text',
      readOnly: true,
      formula: doc => {
        if (doc.address) {
          return doc.getFrom('Address', doc.address, 'addressDisplay');
        }
      }
    }
  ],

  quickEditFields: ['email', 'phone', 'address', 'defaultAccount', 'currency', 'nif']
};
