const utils = require('../../../accounting/utils');
const frappe = require('frappejs');

const { getActions } = require('../Transaction/Transaction');
const PaymentTemplate = require('./PaymentTemplate.vue').default;

module.exports = {
  name: 'Payment',
  label: 'Payment',
  isSingle: 0,
  isChild: 0,
  isSubmittable: 1,
  keywordFields: [],
  printTemplate: PaymentTemplate,
  settings: 'PaymentSettings',
  fields: [
    {
      label: 'Doc AGT', //HELKyds 18-01-2021
      fieldname: 'docAgt',
      fieldtype: 'Data',
      required: 0,
      readOnly: 1
    },

    {
      fieldname: 'party',
      label: 'Party',
      fieldtype: 'Link',
      target: 'Party',
      required: 1
    },
    {
      fieldname: 'date',
      label: 'Posting Date',
      fieldtype: 'Date',
      default: new Date().toISOString()
    },
    {
      fieldname: 'account',
      label: 'From Account',
      fieldtype: 'Link',
      target: 'Account',
      required: 1,
      getFilters: (query, doc) => {
        console.log('account');
        if (doc.paymentType === 'Pay') {
          if (doc.paymentMethod === 'Cash') {
            return { accountType: 'Cash', isGroup: 0 };
          } else {
            return { accountType: ['in', ['Bank', 'Cash']], isGroup: 0 };
          }
        }
      }
    },
    {
      fieldname: 'paymentType',
      label: 'Payment Type',
      fieldtype: 'Select',
      options: ['', 'Receive', 'Pay'],
      required: 1
    },
    {
      fieldname: 'paymentAccount',
      label: 'To Account',
      placeholder: 'To Account',
      fieldtype: 'Link',
      target: 'Account',
      required: 1,
      getFilters: (query, doc) => {
        if (doc.paymentType === 'Receive') {
          if (doc.paymentMethod === 'Cash') {
            return { accountType: 'Cash', isGroup: 0 };
          } else {
            return { accountType: ['in', ['Bank', 'Cash']], isGroup: 0 };
          }
        }
      },
      formula: async doc => {
        if (doc.paymentMethod === 'Cash') {
          let conta = await frappe.db.getAll({
            doctype: 'Account',
            fields: ['name'],
            filters: { account_number: ['like', '45110000%'] }
          });
          console.log(conta);
          console.log(conta[0].name);
          return conta[0].name;
        }
      }
    },
    {
      fieldname: 'paymentMethod',
      label: 'Payment Method',
      placeholder: 'Payment Method',
      fieldtype: 'Select',
      options: ['', 'Cash', 'Cheque', 'Transfer'],
      required: 1
    },
    {
      fieldname: 'referenceId',
      label: 'Ref. / Cheque No.',
      placeholder: 'Ref. / Cheque No.',
      fieldtype: 'Data',
      required: 1 // TODO: UNIQUE
    },
    {
      fieldname: 'referenceDate',
      label: 'Ref. Date',
      placeholder: 'Ref. Date',
      fieldtype: 'Date'
    },
    {
      fieldname: 'clearanceDate',
      label: 'Clearance Date',
      placeholder: 'Clearance Date',
      fieldtype: 'Date',
      hidden: doc => {
        return doc.paymentMethod === 'Cash' ? 1 : 0;
      }
    },
    {
      fieldname: 'amount',
      label: 'Amount',
      fieldtype: 'Currency',
      required: 1 //Helkyds 29-11-2020 Removed Defaults causing error
    },
    {
      fieldname: 'writeoff',
      label: 'Write Off / Refund',
      fieldtype: 'Currency',
      default: 0
    },
    {
      fieldname: 'payfor', //Helkyds 29-11-2020 Renamed from for to payfor
      label: 'Payment For',
      fieldtype: 'Table',
      childtype: 'PaymentFor',
      required: 1
    }
  ],

  quickEditFields: [
    'party',
    'date',
    'paymentMethod',
    'account',
    'paymentType',
    'paymentAccount',
    'referenceId',
    'referenceDate',
    'clearanceDate',
    'amount',
    'writeoff',
    'payfor'
  ],

  layout: [
    {
      columns: [
        {
          fields: ['party', 'account']
        },
        {
          fields: ['date', 'paymentAccount']
        }
      ]
    },
    {
      columns: [
        {
          fields: ['paymentMethod']
        },
        {
          fields: ['paymentType']
        },
        {
          fields: ['referenceId']
        }
      ]
    },
    {
      columns: [
        {
          fields: ['referenceDate']
        },
        {
          fields: ['clearanceDate']
        }
      ]
    },
    {
      columns: [
        {
          fields: ['payfor']
        }
      ]
    },
    {
      columns: [
        {
          fields: ['amount', 'writeoff']
        }
      ]
    }
  ],

  links: [utils.ledgerLink],
  actions: getActions('Payment')
};
